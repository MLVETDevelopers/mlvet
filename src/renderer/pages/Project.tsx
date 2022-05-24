import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import VideoController from 'renderer/components/VideoController';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeDeleteWord, makePasteWord } from 'renderer/store/undoStack/ops';
import VideoPreviewController, {
  VideoPreviewControllerRef,
} from 'renderer/components/VideoPreview/VideoPreviewController';
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

  // UI states
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingWordIndex, setNowPlayingWordIndex] = useState<number>(0);

  const videoPreviewControllerRef = useRef<VideoPreviewControllerRef>(null);

  const play = () => videoPreviewControllerRef?.current?.play();
  const pause = () => videoPreviewControllerRef?.current?.pause();
  const setPlaybackTime = (newPlaybackTime: number) =>
    videoPreviewControllerRef?.current?.setPlaybackTime(newPlaybackTime);
  const seekForward = () => videoPreviewControllerRef?.current?.seekForward();
  const seekBack = () => videoPreviewControllerRef?.current?.seekBack();

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

  // This function will return the index of the first word and the index of the last word
  // selected on the transcription block. It will return values of null for each if no
  // word is selected. It will return the same start and end value if only one value is
  // selected.
  //
  // Currently a little janky and should be revised in a future iteration.
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

  const copyText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      setClipboard({ start, end });
      console.log(`Updated clipboard. Start: ${start} End: ${end}`);
    }
  };

  const deleteText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      deleteWord(start, end);
    }
  };

  const cutText = async () => {
    await copyText();
    await deleteText();
  };

  const pasteText = async () => {
    const [start, end] = await getIndexSelectedWords();
    if (start !== null && end !== null) {
      pasteWord(start, clipboard.start, clipboard.end);
      // Have to update the clipboard indices because they've moved if a word
      // is placed before them
      if (start < clipboard.start) {
        const pasteLength = clipboard.end - clipboard.start + 1;
        setClipboard({
          start: clipboard.start + pasteLength,
          end: clipboard.end + pasteLength,
        });
        console.log(
          `Updated clipboard. Start: ${clipboard.start} End: ${clipboard.end}`
        );
      }
    }
  };

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      console.log('Delete key pressed');
      deleteText();
    } else if (event.key === 'x') {
      console.log('Key "x" pressed');
      cutText();
    } else if (event.key === 'v') {
      console.log('Key "v" pressed');
      pasteText();
    } else if (event.key === 'c') {
      console.log('Key "c" pressed');
      copyText();
    } else if (event.key === 'z') {
      console.log('Key "z" pressed');
      setClipboard({ start: 0, end: 0 }); // Clear the clipboard if there is an undo
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  // TODO: Look into optimisations
  useEffect(() => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      const newPlayingWordIndex = currentProject.transcription.words.findIndex(
        (word) =>
          time >= word.outputStartTime &&
          time <= word.outputStartTime + word.duration &&
          !word.deleted
      );
      if (newPlayingWordIndex !== nowPlayingWordIndex)
        setNowPlayingWordIndex(newPlayingWordIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, currentProject?.transcription]);

  const onWordClick: (wordIndex: number) => void = (wordIndex) => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      const newTime =
        currentProject.transcription.words[wordIndex].outputStartTime;
      setPlaybackTime(newTime);
    }
  };

  return (
    <>
      <VideoController
        time={time}
        isPlaying={isPlaying}
        play={play}
        pause={pause}
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
          {currentProject?.transcription && (
            <TranscriptionBlock
              transcription={currentProject.transcription}
              nowPlayingWordIndex={nowPlayingWordIndex}
              onWordClick={onWordClick}
            />
          )}
        </Stack>
        <Box sx={{ width: '2px', backgroundColor: colors.grey[600] }} />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box
            sx={{ width: '400px', height: '280px', backgroundColor: 'black' }}
          >
            <VideoPreviewController
              setTime={setTime}
              setIsPlaying={setIsPlaying}
              ref={videoPreviewControllerRef}
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
