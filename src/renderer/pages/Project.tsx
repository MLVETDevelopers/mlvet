import { Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import VideoController from 'renderer/components/VideoController';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeDeleteWord, makePasteWord } from 'renderer/store/undoStack/ops';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';

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

  const deleteWord = (firstWordIndex: number, lastWordIndex: number) => {
    if (currentProject && currentProject.transcription) {
      dispatchOp(makeDeleteWord(firstWordIndex, lastWordIndex));
    }
  };

  const pasteWord = (
    toWordIndex: number,
    firstWordIndex: number,
    lastWordIndex: number
  ) => {
    if (currentProject && currentProject.transcription) {
      dispatchOp(makePasteWord(toWordIndex, firstWordIndex, lastWordIndex));
    }
  };

  const getIndexSelectedWords = async () => {
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
      return [start, end];
    }
    return [null, null]; // Linter says I have to return a value here. Could return just null and check outside the function
  };

  // Currently how we check which words have been been copied
  // KNOWN ISSUE: if you paste text in, these indexes wont update
  //     which means that continued pasting may result in incorrect paste targets.
  const [clipboard, setClipboard] = useState({
    start: 0,
    end: 0,
  });

  const deleteText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      deleteWord(start, end);
    }
  };

  const cutText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      setClipboard({ start, end });
      deleteText();
    }
  };

  const pasteText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      console.log(start);
      console.log(clipboard);
      pasteWord(start, clipboard.start, clipboard.end);
    }
  };

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteText();
    } else if (event.key === 'x') {
      cutText();
    } else if (event.key === 'v') {
      pasteText();
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
