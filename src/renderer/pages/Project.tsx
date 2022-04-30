import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from '../components/StandardButton';
import { projectOpened } from '../store/actions';
import { dispatchOp, dispatchUndo } from '../store/opHelpers';
import { ApplicationStore } from '../store/helpers';
import {
  makeChangeWordToSwampOp,
  makeDeleteEverySecondWordOp,
} from '../store/ops';

const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const undoStack = useSelector((store: ApplicationStore) => store.undoStack);

  const dispatch = useDispatch();

  if (currentProject === null) {
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

  const saveButton = (
    <StandardButton onClick={() => window.electron.saveProject(currentProject)}>
      Save
    </StandardButton>
  );

  const openButton = (
    <StandardButton onClick={handleOpenProject}>Open</StandardButton>
  );

  const deleteEverySecondWord: () => void = () => {
    if (currentProject.transcription === null) {
      return;
    }

    dispatchOp(
      dispatch,
      makeDeleteEverySecondWordOp(currentProject.transcription)
    );
  };

  const changeRandomWordToSwamp: () => void = () => {
    if (currentProject.transcription === null) {
      return;
    }

    const wordIndex = Math.floor(
      Math.random() * currentProject.transcription.words.length
    );

    dispatchOp(
      dispatch,
      makeChangeWordToSwampOp(currentProject.transcription, wordIndex)
    );
  };

  const undo: () => void = () => {
    dispatchUndo(dispatch, undoStack);
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
          <Box
            sx={{
              p: 2,
              backgroundColor: '#515151',
              overflow: 'auto',
              height: '100%',
            }}
          >
            {currentProject.transcription?.words
              .map((word) => word.word)
              .join(' ')}
          </Box>
        </Stack>
        <Box sx={{ width: '2px', backgroundColor: 'gray' }} />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box sx={{ width: '400px', height: '280px', backgroundColor: 'red' }}>
            video
          </Box>
          <div>
            <div>{saveButton}</div>
            <div>{openButton}</div>
            Current project data:{' '}
            <pre style={{ width: '200px', overflow: 'auto' }}>
              {JSON.stringify(currentProject)}
            </pre>
            <p>Buttons to demo undo</p>
            <StandardButton onClick={deleteEverySecondWord}>
              Delete Every Second Word
            </StandardButton>
            <StandardButton onClick={changeRandomWordToSwamp}>
              Change a random word to &lsquo;swamp&rsquo;
            </StandardButton>
            <StandardButton onClick={undo}>Undo last action</StandardButton>
            <p>Undo stack:</p>
            <pre style={{ width: '200px', overflow: 'auto' }}>
              {JSON.stringify(undoStack)}
            </pre>
          </div>
        </Stack>
      </Stack>
    </>
  );
};

export default ProjectPage;
