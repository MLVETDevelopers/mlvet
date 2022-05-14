import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import { transcriptionCreated } from 'renderer/store/actions';
import VideoController from 'renderer/components/VideoController';
import { Transcription, Word } from 'sharedTypes';
import { Replay } from 'vimond-replay';
import {
  PlaybackActions,
  VideoStreamState,
} from 'vimond-replay/default-player/Replay';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/helpers';
import colors from '../colors';
import {
  makeChangeWordToSwampOp,
  makeDeleteEverySecondWordOp,
} from '../store/ops';
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
  const dispatch = useDispatch();
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  // RK: I really shouldn't use transcriptionCreated here - but i'm lazy and it works
  const saveTranscription: (transcription: Transcription) => void = useCallback(
    (transcription) => dispatch(transcriptionCreated(transcription)),
    [dispatch]
  );

  const deleteWord = (firstWordIndex: number, numberOfWords: number) => {
    if (currentProject && currentProject.transcription) {
      // eslint-disable-next-line no-plusplus
      for (let i = firstWordIndex; i < firstWordIndex + numberOfWords; i++) {
        currentProject.transcription.words[i].deleted = true;
      }
      saveTranscription(currentProject.transcription);
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
      deleteWord(start, end - start + 1);
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

  const deleteEverySecondWord: () => void = () => {
    // if (currentProject.transcription === null) {
    //   return;
    // }
    // dispatchOp(makeDeleteEverySecondWordOp(currentProject.transcription));
  };

  const changeRandomWordToSwamp: () => void = () => {
    // if (currentProject.transcription === null) {
    //   return;
    // }
    // const wordIndex = Math.floor(
    //   Math.random() * currentProject.transcription.words.length
    // );
    // dispatchOp(
    //   makeChangeWordToSwampOp(currentProject.transcription, wordIndex)
    // );
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

  // Video preview refs
  const videoActions = useRef<null | PlaybackActions>(null);
  // const setVideoProperties = useRef<null | any>(null);

  // UI states
  const [time, setTime] = useState<string>('0');
  const [cccTimeRemaining, setCccTimeRemaining] = useState<string>('0');

  const framesPerSecond = 30;
  const skip = 30;

  // DONE - Sets time of the video preview element to be newTime
  const setVideoTime = (newTime: number) => {
    if (videoActions?.current !== null) {
      videoActions.current.setPosition(newTime);
    }
  };

  function pauseVideo() {
    if (videoActions.current) {
      videoActions.current.pause();
    }
  }

  function playVideo() {
    if (videoActions.current) {
      videoActions.current.play();
    }
  }

  function pause() {
    if (cccRef.current.isRunning) {
      pauseVideo();
      clearInterval(cccRef.current.intervalRef);
      cccRef.current.intervalRef = null;
      cccRef.current.isRunning = false;
    }
  }

  function onFrame() {
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
          cccRef.current.currentCutDuration = currentCut.end - currentCut.start;
          setVideoTime(currentCut.start);

          console.log(currentCut);
        }
      }
    }
  }

  // TODO: confirm the transctionData format
  function getCutIndexFromCutStartTime(
    cutStartTime: number,
    transcriptionData: any
  ) {
    for (let i = 0; i < transcriptionData.length(); i += 1) {
      if (transcriptionData[i].startTime === cutStartTime) {
        return i;
      }
    }
    return null;
  }

  // TODO: confirm the transctionData format
  function getCutIndexFromSystemTime(
    systemTime: number,
    transcriptionData: any
  ) {
    for (let i = 0; i < transcriptionData.length(); i += 1) {
      if (
        transcriptionData[i].startTime <=
        systemTime <=
        transcriptionData[i].endTime
      ) {
        return i;
      }
    }
    return null;
  }

  function play() {
    if (!cccRef.current.isRunning) {
      cccRef.current.isRunning = true;

      playVideo();

      cccRef.current.intervalRef = setInterval(
        onFrame,
        Math.floor(1000 / framesPerSecond)
      );
    }
  }

  function startFromTime(newSystemTime: number) {
    pause();

    if (!cccRef.current.isRunning) {
      cccRef.current.time = 0;
      cccRef.current.performanceStartTime = performance.now() * 0.001;
      systemClockRef.current.startTime = performance.now() * 0.001;

      // TODO: get index from new system time
      const newCut = 1;

      cccRef.current.currentCutIndex = newCut;
      const currentCut = cuts[newCut];
      cccRef.current.currentCutDuration = currentCut.end - currentCut.start;

      setTime(newSystemTime.toFixed(2));
      setVideoTime(currentCut.start);

      play();
    }
  }

  const handlePlaybackActionsReady = (params: PlaybackActions) => {
    // {
    //   setPlaybackProperties: any,
    //   ...actions
    // }
    videoActions.current = params;
    // setVideoProperties.current = params.setPlaybackProperties;
  };

  const handleStreamStateChange = (stateProperties: VideoStreamState) => {
    if (stateProperties) {
      if ('position' in stateProperties) {
        // console.log(
        // 	'Stream observation example: Playback position is ' +
        // 		stateProperties.position.toFixed(1),
        // );
      }
      if (stateProperties.isPaused) {
        console.log('Stream observation example: The playback was paused.');
      }
      if (stateProperties.isPaused === false) {
        console.log('Stream observation example: The playback was resumed.');
      }
      if (stateProperties.playState === 'inactive') {
        console.log('Stream observation example: The playback has ended.');
      }
    }
  };

  const forward = () => {
    setVideoTime(systemClockRef.current.time + skip * 60);
  };

  const back = () => {
    setVideoTime(systemClockRef.current.time - skip * 60);
  };

  // TODO: Error handling
  if (!currentProject?.transcription) {
    return null;
  }
  return (
    <>
      <VideoController />

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
            <Replay
              source="http://localhost:5003/video"
              options={{
                controls: {
                  // includeControls: [],
                  includeControls: [
                    'playPauseButton',
                    'timeline',
                    'timeDisplay',
                    'volume',
                    'fullscreenButton',
                  ],
                },
              }}
              initialPlaybackProps={{ isPaused: true }}
              onStreamStateChange={handleStreamStateChange}
              onPlaybackActionsReady={handlePlaybackActionsReady}
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
