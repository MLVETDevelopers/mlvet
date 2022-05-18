import { useRef, useState, useImperativeHandle, Ref, forwardRef } from 'react';
import { Cut } from 'sharedTypes';
import VideoPreview, { VideoPreviewRef } from '.';
import cuts from '../../../../mocks/cuts';

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

type GetCutFromSystemTime = (systemTime: number, cutsArr: Cut[]) => ExtendedCut;
const getCutFromSystemTime: GetCutFromSystemTime = (systemTime, cutsArr) => {
  let totalCutsTime = 0;

  for (let i = 0; i < cutsArr.length; i += 1) {
    const newTotalCutsTime = totalCutsTime + cutsArr[i].duration;
    if (systemTime <= newTotalCutsTime) {
      const systemTimeDiff = Math.max(systemTime, 0) - totalCutsTime;
      return {
        ...cutsArr[i],
        remainingDuration: cutsArr[i].duration - systemTimeDiff,
        index: i,
      };
    }
    totalCutsTime = newTotalCutsTime;
  }

  const endCutIndex = cutsArr.length - 1;
  return {
    ...cutsArr[endCutIndex],
    remainingDuration: 0,
    index: endCutIndex,
  };
};

const getSystemTimeEnd = (cutsArr: Cut[]) => {
  return cutsArr.reduce((total, cut) => total + cut.duration, 0);
};

const getValidSystemTime = (time: number, cutsArr: Cut[]) => {
  let newTime = Math.max(0, time);
  newTime = Math.min(getSystemTimeEnd(cutsArr), newTime);
  return newTime;
};

const getPerformanceTime = () => performance.now() * 0.001;

interface Props {
  setTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const VideoPreviewControllerBase = (
  { setTime, setIsPlaying }: Props,
  ref: Ref<VideoPreviewControllerRef>
) => {
  // UI states
  const [skip, setSkip] = useState(10);

  const framesPerSecond = 30;

  const videoPreviewRef = useRef<VideoPreviewRef>(null);

  // Global / system clock refs
  const systemClockRef = useRef<SystemClock>({
    prevIntervalTime: 0,
    time: 0,
  });

  // Cut Countdown Clock (ccc) refs
  const cccRef = useRef<CurrentCutClock>({
    currentCutDuration: 0,
    currentCutIndex: 0,
    time: 0,
    prevIntervalTime: 0,
    intervalRef: null,
    isRunning: false,
  });

  const pause = () => {
    if (cccRef.current.isRunning) {
      clearInterval(cccRef.current.intervalRef);
      videoPreviewRef?.current?.pause();
      cccRef.current.intervalRef = null;
      cccRef.current.prevIntervalTime = 0; // Not actually necessary
      systemClockRef.current.prevIntervalTime = 0; // Not actually necessary
      cccRef.current.isRunning = false;
      setIsPlaying(false);
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
        if (cccRef.current.currentCutIndex + 1 >= cuts.length) {
          pause();
        } else {
          cccRef.current.currentCutIndex += 1;
          const currentCut = cuts[cccRef.current.currentCutIndex];
          cccRef.current.currentCutDuration = currentCut.duration;
          videoPreviewRef?.current?.setCurrentTime(currentCut.startTime);
        }
      }
    }
  };

  const start = () => {
    if (!cccRef.current.isRunning) {
      cccRef.current.isRunning = true;

      videoPreviewRef?.current?.play();

      cccRef.current.intervalRef = setInterval(
        onFrame,
        Math.floor(1000 / framesPerSecond)
      );

      cccRef.current.prevIntervalTime = getPerformanceTime();
      systemClockRef.current.prevIntervalTime = getPerformanceTime();

      setIsPlaying(true);
    }
  };

  const setPlaybackTime = (time: number) => {
    const { isRunning } = cccRef.current;
    pause();

    const newSystemTime = getValidSystemTime(time, cuts);
    const newExtendedCut = getCutFromSystemTime(newSystemTime, cuts ?? []);

    cccRef.current.time =
      newExtendedCut.duration - newExtendedCut.remainingDuration;
    cccRef.current.prevIntervalTime = getPerformanceTime();

    systemClockRef.current.prevIntervalTime = getPerformanceTime();
    systemClockRef.current.time = newSystemTime;

    setTime(systemClockRef.current.time);

    cccRef.current.currentCutIndex = newExtendedCut.index;
    cccRef.current.currentCutDuration = newExtendedCut.remainingDuration;

    if (newSystemTime < getSystemTimeEnd(cuts)) {
      videoPreviewRef?.current?.setCurrentTime(newExtendedCut.startTime);

      if (isRunning) {
        start();
      }
    }
  };

  const startFromTime = (newSystemTime: number) => {
    setPlaybackTime(newSystemTime);
    if (newSystemTime < getSystemTimeEnd(cuts)) {
      start();
    }
  };

  const seekForward = () => {
    setPlaybackTime(systemClockRef.current.time + skip);
  };

  const seekBack = () => {
    setPlaybackTime(systemClockRef.current.time - skip);
  };

  const play = () => {
    startFromTime(systemClockRef.current.time);
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    startFromTime,
    seekForward,
    seekBack,
  }));

  return (
    <VideoPreview src="http://localhost:5003/video" ref={videoPreviewRef} />
  );
};

const VideoPreviewController = forwardRef(VideoPreviewControllerBase);

export default VideoPreviewController;
