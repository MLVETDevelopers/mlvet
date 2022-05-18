import { useRef, useImperativeHandle, Ref, forwardRef, useEffect } from 'react';
import { Cut } from 'sharedTypes';
// import cuts from '../../../../mocks/cuts';
import convertTranscriptToCuts from 'main/processing/transcriptToCuts';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import VideoPreview, { VideoPreviewRef } from '.';

export interface Clock {
  prevIntervalTime: number;
  time: number;
  isRunning: boolean;
  intervalRef: null | any;
}

export interface VideoPreviewControllerRef {
  play: () => void;
  pause: () => void;
  startFromTime: (time: number) => void;
  seekForward: () => void;
  seekBack: () => void;
}

interface Props {
  setTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

type GetCutFromSystemTime = (systemTime: number, cuts: Cut[]) => Cut;
const getCutFromSystemTime: GetCutFromSystemTime = (systemTime, cuts) => {
  const foundCut = cuts.find((cut) => cut.outputStartTime <= systemTime);
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

  const transcription = useSelector(
    (store: ApplicationStore) => store?.currentProject?.transcription
  );

  const cuts = useRef<Cut[]>([]);
  const outputVideoLength = useRef<number>(0);

  const clampSystemTime = (time: number) => {
    let newTime = Math.max(0, time);
    newTime = Math.min(outputVideoLength.current, newTime);
    return newTime;
  };

  const clockRef = useRef<Clock>({
    isRunning: false,
    intervalRef: null,
    prevIntervalTime: 0,
    time: 0,
  });

  const currentCutRef = useRef<Cut>({
    index: 0,
    outputStartTime: 0,
    startTime: 0,
    duration: 1,
  });

  const stopTimer = () => {
    clearInterval(clockRef.current.intervalRef);
    clockRef.current.intervalRef = null;
    clockRef.current.isRunning = false;
  };

  const pause = () => {
    videoPreviewRef?.current?.pause();
    setIsPlaying(false);
    stopTimer();
  };

  const onFrame = () => {
    if (clockRef.current.isRunning) {
      clockRef.current.time +=
        getPerformanceTime() - clockRef.current.prevIntervalTime;

      clockRef.current.prevIntervalTime = getPerformanceTime();

      setTime(clockRef.current.time);

      // Has cut finished
      if (
        clockRef.current.time >=
        currentCutRef.current?.outputStartTime + currentCutRef.current?.duration
      ) {
        // console.log(
        //   'Diff: ',
        //   (cccRef.current.time - cccRef.current.currentCutDuration).toFixed(4)
        // );

        // Is this the last cut
        if (currentCutRef.current.index + 1 >= cuts.current.length) {
          console.log('===============================================');
          console.log('===============================================');
          console.log('===============================================');
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

  const startTimer = () => {
    clockRef.current.intervalRef = setInterval(
      onFrame,
      Math.floor(1000 / framesPerSecond)
    );
    clockRef.current.prevIntervalTime = getPerformanceTime();
    clockRef.current.isRunning = true;
  };

  const play = () => {
    if (!clockRef.current.isRunning) {
      if (clockRef.current.time < outputVideoLength.current) {
        videoPreviewRef?.current?.play();
        startTimer();
        setIsPlaying(true);
      }
    }
  };

  const setPlaybackTime = (time: number) => {
    const { isRunning } = clockRef.current;
    stopTimer();

    const newSystemTime = clampSystemTime(time);
    currentCutRef.current = getCutFromSystemTime(
      newSystemTime,
      cuts.current ?? []
    );

    clockRef.current.prevIntervalTime = getPerformanceTime();
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
  };

  const startFromTime = (newSystemTime: number) => {
    pause();
    setPlaybackTime(newSystemTime);
    if (newSystemTime < outputVideoLength.current) {
      play();
    }
  };

  const seekForward = () => {
    setPlaybackTime(clockRef.current.time + skip.current);
  };

  const seekBack = () => {
    setPlaybackTime(clockRef.current.time - skip.current);
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    startFromTime,
    seekForward,
    seekBack,
  }));

  useEffect(() => {
    if (transcription != null) {
      cuts.current = convertTranscriptToCuts(transcription);
      const lastCut = cuts.current[cuts.current.length - 1];
      outputVideoLength.current = lastCut.startTime + lastCut.duration;
      setPlaybackTime(clockRef.current.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcription]);

  useEffect(() => {}, [cuts]);

  return (
    <VideoPreview src="http://localhost:5003/video" ref={videoPreviewRef} />
  );
};

const VideoPreviewController = forwardRef(VideoPreviewControllerBase);

export default VideoPreviewController;
