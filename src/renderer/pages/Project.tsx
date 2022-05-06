import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';

import ExportCard from '../components/ExportCard';
import { dispatchOp, dispatchRedo, dispatchUndo } from '../store/opHelpers';

import { ApplicationStore } from '../store/helpers';
import {
  makeChangeWordToSwampOp,
  makeDeleteEverySecondWordOp,
} from '../store/ops';
import StandardButton from '../components/StandardButton';

const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  const undoStack = useSelector((store: ApplicationStore) => store.undoStack);

  if (currentProject === null) {
    return null;
  }

  const deleteEverySecondWord: () => void = () => {
    if (currentProject.transcription === null) {
      return;
    }

    dispatchOp(makeDeleteEverySecondWordOp(currentProject.transcription));
  };

  const changeRandomWordToSwamp: () => void = () => {
    if (currentProject.transcription === null) {
      return;
    }

    const wordIndex = Math.floor(
      Math.random() * currentProject.transcription.words.length
    );

    dispatchOp(
      makeChangeWordToSwampOp(currentProject.transcription, wordIndex)
    );
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
            <StandardButton
              onClick={dispatchUndo}
              disabled={undoStack.index <= 0}
            >
              Undo last action
            </StandardButton>
            <StandardButton
              onClick={dispatchRedo}
              disabled={undoStack.index >= undoStack.stack.length}
            >
              Redo last action
            </StandardButton>
            <p>Or, use shortcuts from edit menu to undo/redo</p>
            <p>Undo stack:</p>
            <pre style={{ width: '200px', overflow: 'auto' }}>
              {JSON.stringify(undoStack)}
            </pre>
          </div>
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
