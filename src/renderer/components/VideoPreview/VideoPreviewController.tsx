import { useRef, useImperativeHandle, Ref, forwardRef, useEffect } from 'react';
import { Cut } from 'sharedTypes';
// import cuts from '../../../../mocks/cuts';
import convertTranscriptToCuts from 'main/processing/transcriptToCuts';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import VideoPreview, { VideoPreviewRef } from '.';

export interface SystemClock {
  prevIntervalTime: number;
  time: number;
}
export interface CurrentCutClock {
  currentCutDuration: number;
  currentCutIndex: number;
  time: number;
  prevIntervalTime: number;
  isRunning: boolean;
  intervalRef: null | any;
}

interface ExtendedCut extends Cut {
  remainingDuration: number;
  index: number;
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

type GetCutFromSystemTime = (systemTime: number, cuts: Cut[]) => ExtendedCut;
const getCutFromSystemTime: GetCutFromSystemTime = (systemTime, cuts) => {
  for (let i = 0; i < cuts.length; i += 1) {
    if (systemTime <= cuts[i].outputStartTime) {
      return {
        ...cuts[i],
        remainingDuration:
          cuts[i].duration - systemTime + cuts[i].outputStartTime,
        index: i,
      };
    }
  }

  const endCutIndex = cuts.length - 1;
  return {
    ...cuts[endCutIndex],
    remainingDuration: 0,
    index: endCutIndex,
  };
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

  const systemClockRef = useRef<SystemClock>({
    prevIntervalTime: 0,
    time: 0,
  });

  const cccRef = useRef<CurrentCutClock>({
    currentCutDuration: 0,
    currentCutIndex: 0,
    time: 0,
    prevIntervalTime: 0,
    intervalRef: null,
    isRunning: false,
  });

  const stopTimer = () => {
    clearInterval(cccRef.current.intervalRef);
    cccRef.current.intervalRef = null;
  };

  const pause = () => {
    if (cccRef.current.isRunning) {
      videoPreviewRef?.current?.pause();
      cccRef.current.isRunning = false;
      setIsPlaying(false);
      stopTimer();
    }
  };

  const onFrame = () => {
    if (cccRef.current.isRunning) {
      cccRef.current.time +=
        getPerformanceTime() - cccRef.current.prevIntervalTime;
      systemClockRef.current.time +=
        getPerformanceTime() - systemClockRef.current.prevIntervalTime;

      systemClockRef.current.prevIntervalTime = getPerformanceTime();
      cccRef.current.prevIntervalTime = getPerformanceTime();

      setTime(systemClockRef.current.time);

      // Has cut finished
      if (cccRef.current.time >= cccRef.current.currentCutDuration) {
        // console.log(
        //   'Diff: ',
        //   (cccRef.current.time - cccRef.current.currentCutDuration).toFixed(4)
        // );

        cccRef.current.prevIntervalTime = getPerformanceTime();
        cccRef.current.time = 0;

        // Is this the last cut
        if (cccRef.current.currentCutIndex + 1 >= cuts.current.length) {
          pause();
        } else {
          cccRef.current.currentCutIndex += 1;
          const currentCut = cuts.current[cccRef.current.currentCutIndex];
          cccRef.current.currentCutDuration = currentCut.duration;
          videoPreviewRef?.current?.setCurrentTime(currentCut.startTime);
        }
      }
    }
  };

  const startTimer = () => {
    cccRef.current.intervalRef = setInterval(
      onFrame,
      Math.floor(1000 / framesPerSecond)
    );

    cccRef.current.prevIntervalTime = getPerformanceTime();
    systemClockRef.current.prevIntervalTime = getPerformanceTime();
  };

  const play = () => {
    if (!cccRef.current.isRunning) {
      if (systemClockRef.current.time < outputVideoLength.current) {
        cccRef.current.isRunning = true;
        videoPreviewRef?.current?.play();
        startTimer();
        setIsPlaying(true);
      }
    }
  };

  const setPlaybackTime = (time: number) => {
    const { isRunning } = cccRef.current;
    stopTimer();

    const newSystemTime = clampSystemTime(time);
    const newExtendedCut = getCutFromSystemTime(
      newSystemTime,
      cuts.current ?? []
    );

    cccRef.current.time =
      newExtendedCut.duration - newExtendedCut.remainingDuration;
    cccRef.current.prevIntervalTime = getPerformanceTime();

    systemClockRef.current.prevIntervalTime = getPerformanceTime();
    systemClockRef.current.time = newSystemTime;

    setTime(systemClockRef.current.time);

    cccRef.current.currentCutIndex = newExtendedCut.index;
    cccRef.current.currentCutDuration = newExtendedCut.remainingDuration;

    if (newSystemTime < outputVideoLength.current) {
      videoPreviewRef?.current?.setCurrentTime(newExtendedCut.startTime);

      if (isRunning) {
        startTimer();
      }
    }
  };

  const startFromTime = (newSystemTime: number) => {
    setPlaybackTime(newSystemTime);
    if (newSystemTime < outputVideoLength.current) {
      startTimer();
    }
  };

  const seekForward = () => {
    setPlaybackTime(systemClockRef.current.time + skip.current);
  };

  const seekBack = () => {
    setPlaybackTime(systemClockRef.current.time - skip.current);
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
      setPlaybackTime(systemClockRef.current.time);
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
