import {
  useRef,
  useImperativeHandle,
  Ref,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Cut } from 'sharedTypes';
import convertTranscriptToCuts from 'transcriptProcessing/transcriptToCuts';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { clamp } from 'main/timeUtils';
import { Buffer } from 'buffer';
import VideoPreview, { VideoPreviewRef } from '.';

export interface Clock {
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
  outputVideoLength: number;
  setOutputVideoLength: (outputVideoLength: number) => void;
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
  { setTime, setIsPlaying, outputVideoLength, setOutputVideoLength }: Props,
  ref: Ref<VideoPreviewControllerRef>
) => {
  const skip = useRef(10);
  const framesPerSecond = 30;
  const videoPreviewRef = useRef<VideoPreviewRef>(null);

  const currentProject = useSelector(
    (store: ApplicationStore) => store?.currentProject
  );

  const { rangeOverride } = useSelector(
    (store: ApplicationStore) => store?.playback
  );

  const cuts = useRef<Cut[]>([]);
  const [encodedVideoSrc, setEncodedVideoSrc] = useState<string>('');

  const clampSystemTime = (time: number) => clamp(time, 0, outputVideoLength);

  const clockRef = useRef<Clock>({
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
  const pause = () => {
    videoPreviewRef?.current?.pause();
    setIsPlaying(false);
    stopTimer();
  };

  const resetClockRef = () => {
    clockRef.current.isRunning = false;
    clockRef.current.intervalRef = null;
    clockRef.current.prevIntervalEndTime = getPerformanceTime();
    clockRef.current.intervalStartTime = getPerformanceTime();
    clockRef.current.time = 0;
  };

  const resetVideoPreview = () => {
    pause();
    resetClockRef();
  };

  // Called on every frame (by timer setInterval)
  const onFrame = () => {
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
          pause();
        } else {
          currentCutRef.current = cuts.current[currentCutRef.current.index + 1];
          videoPreviewRef?.current?.setCurrentTime(
            currentCutRef.current.startTime
          );
        }
      }
    }
  };

  // Start timer (setInterval)
  const startTimer = () => {
    if (clockRef.current.time === 0) {
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
  };

  // Sets the video, timer & UI playback time
  const setPlaybackTime = (time: number) => {
    const { isRunning } = clockRef.current;
    if (isRunning) stopTimer();

    const newSystemTime = clampSystemTime(time);
    currentCutRef.current = getCutFromSystemTime(
      newSystemTime,
      cuts.current ?? []
    );

    clockRef.current.intervalStartTime -= newSystemTime - clockRef.current.time;

    clockRef.current.time = newSystemTime;
    setTime(clockRef.current.time);

    if (newSystemTime < outputVideoLength) {
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
  };

  // Starts video, timer & UI
  const play = () => {
    if (!clockRef.current.isRunning) {
      // If we're at the end of the video, restart it
      if (clockRef.current.time >= outputVideoLength) {
        // Video preview must be reset (including clock ref) or else the clock will start later than 0 after pressing play
        resetVideoPreview();
        setPlaybackTime(0);
      }

      startTimer();
      videoPreviewRef?.current?.play();
      setIsPlaying(true);
    }
  };

  // Skips forward 'n' seconds
  const seekForward = () => {
    setPlaybackTime(clockRef.current.time + skip.current);
  };

  // Skips backward 'n' seconds
  const seekBack = () => {
    setPlaybackTime(clockRef.current.time - skip.current);
  };

  const updateCuts = () => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      cuts.current = convertTranscriptToCuts(
        currentProject.transcription,
        rangeOverride
      );

      if (cuts.current.length === 0) {
        return false;
      }

      const lastCut = cuts.current[cuts.current.length - 1];

      setOutputVideoLength(lastCut.outputStartTime + lastCut.duration);

      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    setPlaybackTime,
    seekForward,
    seekBack,
  }));

  useEffect(() => {
    const shouldContinue = updateCuts();

    if (!shouldContinue) {
      return;
    }

    setPlaybackTime(clockRef.current.time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.transcription, setOutputVideoLength]);

  useEffect(() => {
    setEncodedVideoSrc(
      Buffer.from(currentProject?.mediaFilePath ?? '', 'utf-8').toString(
        'base64'
      )
    );
  }, [currentProject?.mediaFilePath]);

  useEffect(() => {
    const shouldContinue = updateCuts();

    if (!shouldContinue) {
      return;
    }

    resetVideoPreview();
    setPlaybackTime(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    rangeOverride === null ? pause() : play();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeOverride]);

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
