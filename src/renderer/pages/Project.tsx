import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import VideoController from 'renderer/components/VideoController';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeDeleteWord } from 'renderer/store/undoStack/ops';
import { Cut } from 'sharedTypes';
import VideoPreview from 'renderer/components/VideoPreview';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import cuts from './cuts';

export interface SystemClock {
  startTime: number;
  time: number;
}
export interface CurrentCutClock {
  currentCutDuration: number;
  currentCutIndex: number;
  time: number;
  performanceStartTime: number;
  isRunning: boolean;
  intervalRef: null | any;
}

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

  const videoPreviewRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Global / system clock refs
  const systemClockRef = useRef<SystemClock>({
    startTime: 0,
    time: 0,
  });

  // Cut Countdown Clock (ccc) refs
  const cccRef = useRef<CurrentCutClock>({
    currentCutDuration: 0,
    currentCutIndex: 0,
    time: 0,
    performanceStartTime: 0,
    isRunning: false,
    intervalRef: null,
  });

  // UI states
  const [time, setTime] = useState<string>('0');
  const [cccTimeRemaining, setCccTimeRemaining] = useState<string>('0');

  const framesPerSecond = 30;
  const skip = 10;

  const getCutIndexFromSystemTime = (systemTime: number, cutsArr: Cut[]) => {
    const index = cutsArr.findIndex(
      (cut) =>
        cut.startTime <= systemTime &&
        systemTime <= cut.startTime + cut.duration
    );
    return index === -1 ? 0 : index;
  };

  const pause = () => {
    if (cccRef.current.isRunning) {
      videoPreviewRef.current.pause();
      clearInterval(cccRef.current.intervalRef);
      cccRef.current.intervalRef = null;
      cccRef.current.isRunning = false;
      setIsPlaying(false);
    }
  };

  const onFrame = () => {
    if (cccRef.current.isRunning) {
      cccRef.current.time =
        performance.now() * 0.001 - cccRef.current.performanceStartTime;
      systemClockRef.current.time =
        performance.now() * 0.001 - cccRef.current.performanceStartTime;
      setTime(systemClockRef.current.time.toFixed(2));

      // Has cut finished
      if (cccRef.current.time >= cccRef.current.currentCutDuration) {
        // console.log('CCC: ', cccTimeRef.current);
        // console.log('Duration: ', currentCutDurationRef.current.toFixed(4));
        console.log(
          'Diff: ',
          (cccRef.current.time - cccRef.current.currentCutDuration).toFixed(4)
        );

        cccRef.current.performanceStartTime = performance.now() * 0.001;
        cccRef.current.time = 0;

        // Is this the last cut
        if (cccRef.current.currentCutIndex + 1 >= cuts.length) {
          pause();
        } else {
          cccRef.current.currentCutIndex += 1;
          const currentCut = cuts[cccRef.current.currentCutIndex];
          cccRef.current.currentCutDuration = currentCut.duration;
          videoPreviewRef.current.setCurrentTime(currentCut.startTime);

          console.log(currentCut);
        }
      }
    }
  };

  const play = () => {
    if (!cccRef.current.isRunning) {
      cccRef.current.isRunning = true;

      videoPreviewRef.current.play();

      cccRef.current.intervalRef = setInterval(
        onFrame,
        Math.floor(1000 / framesPerSecond)
      );

      setIsPlaying(true);
    }
  };

  const startFromTime = (newSystemTime: number) => {
    pause();

    if (!cccRef.current.isRunning) {
      cccRef.current.time = 0;
      cccRef.current.performanceStartTime = performance.now() * 0.001;
      systemClockRef.current.startTime = performance.now() * 0.001;

      const newCut = getCutIndexFromSystemTime(
        newSystemTime,
        currentProject?.transcription?.words ?? []
      );
      console.log('newCut', newCut);

      cccRef.current.currentCutIndex = newCut;
      const currentCut = cuts[newCut];
      cccRef.current.currentCutDuration = currentCut.duration;

      setTime(newSystemTime.toFixed(2));
      videoPreviewRef.current.setCurrentTime(currentCut.startTime);

      videoPreviewRef.current.play();

      play();
    }
  };

  const restart = () => {
    startFromTime(0);
  };

  const seekForward = () => {
    startFromTime(systemClockRef.current.time + skip);
  };

  const seekBack = () => {
    startFromTime(systemClockRef.current.time - skip);
  };

  useEffect(() => {
    console.log(videoPreviewRef.current);
  }, [videoPreviewRef]);

  // TODO: Error handling
  if (!currentProject?.transcription) {
    return null;
  }
  return (
    <>
      <VideoController
        isPlaying={isPlaying}
        play={play}
        pause={pause}
        restart={restart}
        seekForward={seekForward}
        seekBack={seekBack}
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
