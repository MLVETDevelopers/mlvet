import {
  useRef,
  useImperativeHandle,
  Ref,
  forwardRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Cut } from 'sharedTypes';
import convertTranscriptToCuts from 'transcriptProcessing/transcriptToCuts';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { clamp } from 'main/timeUtils';
import { Buffer } from 'buffer';
import store from 'renderer/store/store';
import { videoPlaying, videoSeek } from 'renderer/store/playback/actions';
import VideoPreview, { VideoPreviewRef } from '.';

export interface Clock {
  hasRunBefore: boolean;
  time: number;
  isRunning: boolean;
  intervalRef: null | any;
  prevIntervalEndTime: number;
  intervalStartTime: number;
}

export interface VideoPreviewControllerRef {
  play: () => void;
  pause: () => void;
  setPlaybackTime: (time: number) => void;
  seekForward: () => void;
  seekBack: () => void;
}

interface Props {
  setTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

type GetCutFromSystemTime = (systemTime: number, cuts: Cut[]) => Cut;
const getCutFromSystemTime: GetCutFromSystemTime = (systemTime, cuts) => {
  const foundCut = cuts.find(
    (cut) =>
      cut.outputStartTime <= systemTime &&
      cut.outputStartTime + cut.duration >= systemTime
  );
  return foundCut ?? cuts[cuts.length - 1];
};

const getPerformanceTime = () => performance.now() * 0.001;

const VideoPreviewControllerBase = (
  { setTime, setIsPlaying }: Props,
  ref: Ref<VideoPreviewControllerRef>
) => {
  const skip = useRef(10);
  const framesPerSecond = 30;
  const videoPreviewRef = useRef<VideoPreviewRef>(null);

  const currentProject = useSelector(
    (appStore: ApplicationStore) => appStore?.currentProject
  );
  const playState = useSelector(
    (appStore: ApplicationStore) => appStore.playback.isPlaying
  );

  const timeState = useSelector(
    (appStore: ApplicationStore) => appStore.playback.time
  );

  const cuts = useRef<Cut[]>([]);
  const outputVideoLength = useRef<number>(0);
  const [encodedVideoSrc, setEncodedVideoSrc] = useState<string>('');

  const clampSystemTime = (time: number) =>
    clamp(time, 0, outputVideoLength.current);

  const clockRef = useRef<Clock>({
    hasRunBefore: false,
    isRunning: false,
    intervalRef: null,
    prevIntervalEndTime: getPerformanceTime(),
    intervalStartTime: getPerformanceTime(),
    time: 0,
  });

  const currentCutRef = useRef<Cut>({
    index: 0,
    outputStartTime: 0,
    startTime: 0,
    duration: 1,
  });

  // Stops timer
  const stopTimer = () => {
    clearInterval(clockRef.current.intervalRef);
    clockRef.current.intervalRef = null;
    clockRef.current.isRunning = false;
    clockRef.current.prevIntervalEndTime = getPerformanceTime();
  };

  // Stops video, timer & UI
  const pause = useCallback(() => {
    videoPreviewRef?.current?.pause();
    setIsPlaying(false);
    stopTimer();
  }, [setIsPlaying]);

  // Called on every frame (by timer setInterval)
  const onFrame = useCallback(() => {
    if (clockRef.current.isRunning) {
      clockRef.current.time =
        getPerformanceTime() - clockRef.current.intervalStartTime;

      setTime(clockRef.current.time);
      // TODO: Update UI to reflect changing time

      // Has cut finished
      if (
        clockRef.current.time >=
        currentCutRef.current?.outputStartTime + currentCutRef.current?.duration
      ) {
        // If last put - pause
        // If not - update video
        if (currentCutRef.current.index + 1 >= cuts.current.length) {
          store.dispatch(
            videoPlaying({
              isPlaying: false,
              lastUpdated: new Date(),
            })
          );
          pause();
        } else {
          currentCutRef.current = cuts.current[currentCutRef.current.index + 1];
          videoPreviewRef?.current?.setCurrentTime(
            currentCutRef.current.startTime
          );
        }
      }
    }
  }, [pause, setTime]);

  // Start timer (setInterval)
  const startTimer = useCallback(() => {
    if (!clockRef.current.hasRunBefore) {
      clockRef.current.hasRunBefore = true;
      clockRef.current.prevIntervalEndTime = getPerformanceTime();
      clockRef.current.intervalStartTime = getPerformanceTime();
    }
    clockRef.current.intervalRef = setInterval(
      onFrame,
      Math.floor(1000 / framesPerSecond)
    );
    clockRef.current.intervalStartTime +=
      getPerformanceTime() - clockRef.current.prevIntervalEndTime;
    clockRef.current.isRunning = true;
  }, [onFrame]);

  // Sets the video, timer & UI playback time
  const setPlaybackTime = useCallback(
    (time: number) => {
      const { isRunning } = clockRef.current;
      if (isRunning) stopTimer();

      const newSystemTime = clampSystemTime(time);
      currentCutRef.current = getCutFromSystemTime(
        newSystemTime,
        cuts.current ?? []
      );

      clockRef.current.intervalStartTime -=
        newSystemTime - clockRef.current.time;

      clockRef.current.time = newSystemTime;
      setTime(clockRef.current.time);

      if (newSystemTime < outputVideoLength.current) {
        const inCutStartTime =
          currentCutRef.current.startTime +
          (clockRef.current.time - currentCutRef.current.outputStartTime);
        videoPreviewRef?.current?.setCurrentTime(inCutStartTime);

        if (isRunning) {
          startTimer();
        }
      } else {
        pause();
      }
    },
    [pause, setTime, startTimer]
  );

  // Starts video, timer & UI
  const play = useCallback(() => {
    if (!clockRef.current.isRunning) {
      // If we're at the end of the video, restart it
      if (clockRef.current.time >= outputVideoLength.current) {
        setPlaybackTime(0);
      }
      startTimer();
      videoPreviewRef?.current?.play();
      setIsPlaying(true);
    }
  }, [setIsPlaying, setPlaybackTime, startTimer]);

  // Skips forward 'n' seconds
  const seekForward = () => {
    setPlaybackTime(clockRef.current.time + skip.current);
  };

  // Skips backward 'n' seconds
  const seekBack = () => {
    setPlaybackTime(clockRef.current.time - skip.current);
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    setPlaybackTime,
    seekForward,
    seekBack,
  }));

  useEffect(() => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      cuts.current = convertTranscriptToCuts(currentProject.transcription);
      if (cuts.current.length === 0) {
        return;
      }
      const lastCut = cuts.current[cuts.current.length - 1];
      outputVideoLength.current = lastCut.outputStartTime + lastCut.duration;
      setPlaybackTime(clockRef.current.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.transcription]);

  useEffect(() => {
    setEncodedVideoSrc(
      Buffer.from(currentProject?.mediaFilePath ?? '', 'utf-8').toString(
        'base64'
      )
    );
  }, [currentProject?.mediaFilePath]);

  // If the state of play/pause is changed, play/pause the video preview
  // if the video is paused, update the time in redux
  useEffect(() => {
    if (playState) {
      play();
    } else {
      pause();
      store.dispatch(
        videoSeek({
          time: clockRef.current.time,
          lastUpdated: new Date(),
        })
      );
    }
  }, [pause, play, playState]);

  // if the state of playback time is changed, set the time accordingly for video preview
  useEffect(() => {
    setPlaybackTime(timeState);
  }, [setPlaybackTime, timeState]);

  return (
    <VideoPreview
      src={
        encodedVideoSrc ? `http://localhost:5556/video/${encodedVideoSrc}` : ''
      }
      ref={videoPreviewRef}
    />
  );
};

const VideoPreviewController = forwardRef(VideoPreviewControllerBase);

export default VideoPreviewController;
