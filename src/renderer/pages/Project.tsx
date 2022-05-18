import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import VideoController from 'renderer/components/VideoController';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeDeleteWord } from 'renderer/store/undoStack/ops';
import { Cut } from 'sharedTypes';
import VideoPreview, {
  VideoPreviewRef,
} from 'renderer/components/VideoPreview';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import cuts from '../../../mocks/cuts';

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

/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  // UI states
  const [skip, setSkip] = useState(10);
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const getPerformanceTime = () => performance.now() * 0.001;

  const deleteWord = (firstWordIndex: number, lastWordIndex: number) => {
    if (currentProject && currentProject.transcription) {
      dispatchOp(makeDeleteWord(firstWordIndex, lastWordIndex));
    }
  };

  const deleteText = async () => {
    const highlightedWords = window.getSelection();
    if (
      highlightedWords?.anchorNode?.parentElement?.dataset.type === 'word' &&
      highlightedWords?.focusNode?.parentElement?.dataset.type === 'word'
    ) {
      const anchor = await Number(
        highlightedWords?.anchorNode?.parentElement?.dataset.index
      );
      const focus = await Number(
        highlightedWords?.focusNode?.parentElement?.dataset.index
      );

      const start = Math.min(anchor, focus);
      const end = Math.max(anchor, focus);
      deleteWord(start, end);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteText();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  // TODO: figure out return type
  const onWordClick: (wordIndex: number) => void = () => {
    // TODO: Implement onWordClick
    if (currentProject !== null) {
      // return currentProject.transcription?.words[wordIndex];
    }
  };

  const Pause = () => {
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
          Pause();
        } else {
          cccRef.current.currentCutIndex += 1;
          const currentCut = cuts[cccRef.current.currentCutIndex];
          cccRef.current.currentCutDuration = currentCut.duration;
          videoPreviewRef?.current?.setCurrentTime(currentCut.startTime);
        }
      }
    }
  };

  const Play = () => {
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

  const SetPlaybackTime = (newSystemTime: number) => {
    const { isRunning } = cccRef.current;
    if (isRunning) {
      Pause();
    }

    const newExtendedCut = getCutFromSystemTime(newSystemTime, cuts ?? []);

    cccRef.current.time =
      newExtendedCut.duration - newExtendedCut.remainingDuration;
    cccRef.current.prevIntervalTime = getPerformanceTime();

    systemClockRef.current.prevIntervalTime = getPerformanceTime();
    systemClockRef.current.time = Math.min(
      newExtendedCut.startTime + newExtendedCut.duration,
      Math.max(newSystemTime, 0)
    );
    setTime(systemClockRef.current.time);

    cccRef.current.currentCutIndex = newExtendedCut.index;
    cccRef.current.currentCutDuration = newExtendedCut.remainingDuration;

    videoPreviewRef?.current?.setCurrentTime(newExtendedCut.startTime);

    if (isRunning) {
      Play();
    }
  };

  const StartFromTime = (newSystemTime: number) => {
    Pause();
    SetPlaybackTime(newSystemTime);
    Play();
  };

  const Restart = () => {
    SetPlaybackTime(0);
  };

  const SeekForward = () => {
    SetPlaybackTime(systemClockRef.current.time + skip);
  };

  const SeekBack = () => {
    SetPlaybackTime(systemClockRef.current.time - skip);
  };

  // TODO: Error handling
  if (!currentProject?.transcription) {
    return null;
  }
  return (
    <>
      <VideoController
        time={time}
        isPlaying={isPlaying}
        play={Play}
        pause={Pause}
        restart={Restart}
        seekForward={SeekForward}
        seekBack={SeekBack}
      />

      <Stack
        direction="row"
        sx={{
          height: 'calc(100% - 76px)',
          gap: '48px',
          px: '48px',
          py: '32px',
        }}
      >
        <Stack spacing={4} sx={{ flex: '5 1 0' }}>
          <TranscriptionBlock
            transcription={currentProject.transcription}
            onWordClick={onWordClick}
          />
        </Stack>
        <Box sx={{ width: '2px', backgroundColor: colors.grey[600] }} />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box
            sx={{ width: '400px', height: '280px', backgroundColor: 'black' }}
          >
            <VideoPreview
              src="http://localhost:5003/video"
              ref={videoPreviewRef}
            />
          </Box>
        </Stack>
        {isExporting && (
          <div style={{ position: 'absolute', right: '32px', bottom: '32px' }}>
            <ExportCard progress={exportProgress} />
          </div>
        )}
      </Stack>
    </>
  );
};

export default ProjectPage;
