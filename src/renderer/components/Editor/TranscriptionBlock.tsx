import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React, { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IndexRange, TakeGroup, Transcription, Word } from 'sharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeCorrectWord } from 'renderer/store/transcriptionWords/ops/correctWord';
import { editWordFinished } from 'renderer/store/editWord/actions';
import { makeDeleteSelection } from 'renderer/store/transcriptionWords/ops/deleteSelection';
import { emptyRange, rangeLengthOne } from 'renderer/utils/range';
import {
  generateTranscriptionChunks,
  getTakeGroupLength,
  isTakeGroup,
} from 'renderer/utils/takeDetection';
import { mapWithAccumulator } from 'renderer/utils/list';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import DragSelectManager from './DragSelectManager';
import {
  selectionCleared,
  selectionRangeSetTo,
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
  blockWidth: number;
  setPlaybackTime: (time: number) => void;
}

const TranscriptionBlock = ({
  transcription,
  nowPlayingWordIndex,
  blockWidth,
  setPlaybackTime,
}: Props) => {
  const editWord = useSelector((store: ApplicationStore) => store.editWord);

  const blockRef = useRef<HTMLElement>(null);

  const transcriptionChunks = useMemo(() => {
    return generateTranscriptionChunks(
      transcription.words,
      transcription.takeGroups
    );
  }, [transcription]);

  const selection = useSelector((store: ApplicationStore) => store.selection);

  const ownSelection = useMemo(
    () => (editWord === null ? selection.self : emptyRange()),
    [selection, editWord]
  );

  const otherSelections = useMemo(() => {
    const selections: Record<ClientId, IndexRange> = {};
    Object.keys(selection.others).forEach((clientId) => {
      selections[clientId] = selection.others[clientId];
    });

    return selections;
  }, [selection]);

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
      dispatchOp(makeDeleteSelection(rangeLengthOne(index)));
    } else {
      // If the user edits a word, update the word then select it
      dispatchOp(makeCorrectWord(transcription.words, index, editWord.text));
      dispatch(selectionRangeSetTo(rangeLengthOne(index)));
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
    <DragSelectManager clearSelection={clearSelection}>
      {(onWordMouseDown, onWordMouseEnter) => {
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
                      onWordMouseEnter={onWordMouseEnter}
                      editWord={editWord}
                      nowPlayingWordIndex={nowPlayingWordIndex}
                      transcription={transcription}
                      submitWordEdit={submitWordEdit}
                      selection={ownSelection}
                      otherSelections={otherSelections}
                      popoverWidth={blockWidth - 194}
                      transcriptionBlockRef={blockRef}
                      setPlaybackTime={setPlaybackTime}
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
    </DragSelectManager>
  );
};

export default React.memo(TranscriptionBlock);
