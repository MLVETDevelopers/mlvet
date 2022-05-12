import { Box, Stack } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import { transcriptionCreated } from 'renderer/store/actions';
import { Transcription } from 'sharedTypes';
import VideoController from 'renderer/components/VideoController';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/helpers';
import colors from '../colors';
import {
  makeChangeWordToSwampOp,
  makeDeleteEverySecondWordOp,
} from '../store/ops';


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

  // TODO: Error handling
  if (!currentProject?.transcription) {
    return null;
  }

  const onWordClick = (wordIndex: number) => {
    // TODO: Implement onWordClick
    return currentProject.transcription?.words[wordIndex];
  };

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
            video
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
