/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from 'renderer/components/StandardButton';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import { projectOpened, transcriptionCreated } from 'renderer/store/actions';
import { Transcription, Word } from 'sharedTypes';
import { ApplicationStore } from '../store/helpers';

/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const ProjectPage = () => {
  const dispatch = useDispatch();

  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  // RK: I really shouldn't use transcriptionCreated here - but i'm lazy and it works
  const saveTranscription: (transcription: Transcription) => void = useCallback(
    (transcription) => dispatch(transcriptionCreated(transcription)),
    [dispatch]
  );

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  if (currentProject === null || currentProject?.transcription === null) {
    return null;
  }

  const handleOpenProject = async () => {
    try {
      const project = await window.electron.openProject();
      dispatch(projectOpened(project));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWord = (firstWordIndex: number, numberOfWords: number) => {
    if (currentProject.transcription) {
      currentProject.transcription?.words.splice(firstWordIndex, numberOfWords);
      saveTranscription(currentProject.transcription);
    }
  };

  const saveButton = (
    <StandardButton onClick={() => window.electron.saveProject(currentProject)}>
      Save
    </StandardButton>
  );

  const openButton = (
    <StandardButton onClick={handleOpenProject}>Open</StandardButton>
  );

  const onWordClick = (wordIndex: number) => {
    setSelectedWordIndex(wordIndex);
  };

  const deleteText = async () => {
    const highlightedWords = window.getSelection();
    console.log('delete text');
    if (
      highlightedWords?.anchorNode &&
      highlightedWords?.focusNode &&
      highlightedWords.anchorNode.nodeName === '#text'
    ) {
      console.log(highlightedWords);
      const anchor = await Number(highlightedWords?.anchorNode?.parentElement.dataset.index);
      const focus = await Number(highlightedWords?.focusNode?.parentElement.dataset.index);

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
          {/* <Button onClick={deleteWord}>Delete</Button> */}
          <span style={{ color: 'white' }}>
            {selectedWordIndex
              ? JSON.stringify(
                  currentProject.transcription.words[selectedWordIndex]
                )
              : 'Selected a word'}
          </span>
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
            <div>{openButton}</div>
          </div>
        </Stack>
      </Stack>
    </>
  );
};

export default ProjectPage;
