import { Box, Button, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from 'renderer/components/StandardButton';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import { projectOpened, transcriptionCreated } from 'renderer/store/actions';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/helpers';

/*
This is the page that gets displayed while you are editting a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const ProjectPage = () => {
  const dispatch = useDispatch();

  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

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

  const deleteWord = () => {
    if (selectedWordIndex && currentProject.transcription) {
      currentProject.transcription?.words.splice(selectedWordIndex, 1);
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
          <Button onClick={deleteWord}>Delete</Button>
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
