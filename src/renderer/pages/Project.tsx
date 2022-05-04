import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from 'renderer/components/StandardButton';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import { transcriptionCreated } from 'renderer/store/actions';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/helpers';

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
    console.log(currentProject.transcription?.words[wordIndex]);
  };

  const saveButton = (
    <StandardButton onClick={() => window.electron.saveProject(currentProject)}>
      Save
    </StandardButton>
  );

  return (
    <>
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
        <Box sx={{ width: '2px', backgroundColor: 'gray' }} />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box
            sx={{ width: '400px', height: '280px', backgroundColor: 'black' }}
          >
            video
          </Box>
          <div>
            <div>{saveButton}</div>
          </div>
        </Stack>
      </Stack>
    </>
  );
};

export default ProjectPage;
