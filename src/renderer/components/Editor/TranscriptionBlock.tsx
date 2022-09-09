import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TakeGroup, Transcription, Word } from 'sharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeCorrectWord } from 'renderer/store/transcriptionWords/ops/correctWord';
import { editWordFinished } from 'renderer/store/editWord/actions';
import { makeDeleteSelection } from 'renderer/store/transcriptionWords/ops/deleteSelection';
import { rangeLengthOne } from 'renderer/utils/range';
import {
  generateTranscriptionChunks,
  getTakeGroupLength,
  isTakeGroup,
} from 'renderer/utils/takeDetection';
import { mapWithAccumulator } from 'renderer/utils/list';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import WordDragManager from './WordDragManager';
import {
  selectionCleared,
  selectionRangeAdded,
} from '../../store/selection/actions';
import TranscriptionChunk from './TranscriptionChunk';

const TranscriptionBox = styled(Box)({
  position: 'relative',
  background: colors.grey[700],
  borderRadius: '5px',
  color: colors.grey[300],
  overflowX: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  padding: '20px',
  userSelect: 'none',

  '::-webkit-scrollbar': {
    width: '3px',
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: colors.yellow[500],
  },
});

interface Props {
  transcription: Transcription;
  nowPlayingWordIndex: number | null;
  seekToWord: (wordIndex: number) => void;
  blockWidth: number;
}

const TranscriptionBlock = ({
  seekToWord,
  transcription,
  nowPlayingWordIndex,
  blockWidth,
}: Props) => {
  const editWord = useSelector((store: ApplicationStore) => store.editWord);

  const blockRef = useRef<HTMLElement>(null);

  const transcriptionChunks = useMemo(() => {
    return generateTranscriptionChunks(
      transcription.words,
      transcription.takeGroups
    );
  }, [transcription]);

  const ownSelectionArray = useSelector(
    (store: ApplicationStore) => store.selection.self
  );

  const ownSelectionSet = useMemo(
    () => (editWord === null ? new Set(ownSelectionArray) : new Set<number>()),
    [ownSelectionArray, editWord]
  );

  const otherSelections = useSelector(
    (store: ApplicationStore) => store.selection.others
  );

  const otherSelectionSets = useMemo(() => {
    const sets: Record<ClientId, Set<number>> = {};
    Object.keys(otherSelections).forEach((clientId) => {
      sets[clientId] = new Set(otherSelections[clientId]);
    });
    return sets;
  }, [otherSelections]);

  const dispatch = useDispatch();

  const submitWordEdit: () => void = useCallback(() => {
    if (editWord === null) {
      return;
    }

    const { index } = editWord;

    // Clear the selection to start with - the word might be re-selected later
    dispatch(selectionCleared());

    if (editWord.text === '') {
      // If the user edits a word to be empty, treat this as a delete action
      dispatchOp(makeDeleteSelection([rangeLengthOne(index)]));
    } else {
      // If the user edits a word, update the word then select it
      dispatchOp(makeCorrectWord(transcription.words, index, editWord.text));
      dispatch(selectionRangeAdded(rangeLengthOne(index)));
    }

    // Mark the edit as over
    dispatch(editWordFinished());
  }, [editWord, dispatch, transcription]);

  const clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void = useCallback(
    (dragSelectAnchor, clearAnchor) => {
      if (editWord !== null) {
        clearAnchor();
        submitWordEdit();
      } else if (dragSelectAnchor === null) {
        dispatch(selectionCleared());
      } else {
        clearAnchor();
      }
    },
    [editWord, submitWordEdit, dispatch]
  );

  return (
    <WordDragManager clearSelection={clearSelection}>
      {(
        onWordMouseDown,
        onWordMouseMove,
        dragState,
        isWordBeingDragged,
        mouse,
        mouseThrottled,
        dropBeforeIndex,
        setDropBeforeIndex,
        cancelDrag
      ) => {
        return (
          <TranscriptionBox id="transcription-content" ref={blockRef}>
            {mapWithAccumulator(
              transcriptionChunks,
              (chunk, _, acc) => {
                return {
                  item: (
                    <TranscriptionChunk
                      key={
                        isTakeGroup(chunk)
                          ? `take-group-chunk-${(chunk as TakeGroup).id}`
                          : `word-chunk-${(chunk as Word).originalIndex}-${
                              (chunk as Word).pasteKey
                            }`
                      }
                      chunk={chunk}
                      chunkIndex={acc}
                      onWordMouseDown={onWordMouseDown}
                      onWordMouseMove={onWordMouseMove}
                      dragState={dragState}
                      isWordBeingDragged={isWordBeingDragged}
                      mousePosition={mouse}
                      mouseThrottled={mouseThrottled}
                      dropBeforeIndex={dropBeforeIndex}
                      setDropBeforeIndex={setDropBeforeIndex}
                      cancelDrag={cancelDrag}
                      editWord={editWord}
                      nowPlayingWordIndex={nowPlayingWordIndex}
                      transcription={transcription}
                      seekToWord={seekToWord}
                      submitWordEdit={submitWordEdit}
                      selectionSet={ownSelectionSet}
                      otherSelectionSets={otherSelectionSets}
                      popoverWidth={blockWidth - 194}
                      transcriptionBlockRef={blockRef}
                    />
                  ),
                  acc: isTakeGroup(chunk)
                    ? acc +
                      getTakeGroupLength(
                        chunk as TakeGroup,
                        transcription.words
                      )
                    : acc + 1,
                };
              },
              0
            )}
          </TranscriptionBox>
        );
      }}
    </WordDragManager>
  );
};

export default TranscriptionBlock;
