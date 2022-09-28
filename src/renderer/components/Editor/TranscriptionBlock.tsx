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
} from 'renderer/utils/takeDetection';
import { mapWithAccumulator } from 'renderer/utils/list';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { isTakeGroup } from 'sharedUtils';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import DragSelectManager from './DragSelectManager';
import {
  selectionCleared,
  selectionRangeSetTo,
} from '../../store/selection/actions';
import TranscriptionChunkComponent from './TranscriptionChunkComponent';

const TranscriptionBox = styled(Box)({
  position: 'relative',
  background: colors.grey[700],
  borderRadius: '5px',
  color: colors.grey[300],
  overflowX: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  paddingTop: '70px',
  paddingBottom: '45px',
  paddingLeft: '70px',
  paddingRight: '70px',
  userSelect: 'none',

  '::-webkit-scrollbar': {
    width: '3px',
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: colors.yellow[500],
  },
});

const ProjectName = styled(Box)({
  fontSize: 18,
  lineHeight: '28px',
  fontWeight: 'bold',
  marginBottom: 20,
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

  const projectName = useSelector(
    (store: ApplicationStore) => store.currentProject?.name
  );

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

    if (transcription.words[index].word === null) {
      return;
    }

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
      {(
        onWordMouseDown,
        onWordMouseEnter,
        partialSelectState,
        setPartialSelectState,
        isMouseDown
      ) => {
        return (
          <TranscriptionBox id="transcription-content" ref={blockRef}>
            <ProjectName>{projectName}</ProjectName>
            {mapWithAccumulator(
              transcriptionChunks,
              (chunk, _, acc) => {
                return {
                  item: (
                    <TranscriptionChunkComponent
                      key={
                        isTakeGroup(chunk)
                          ? `take-group-chunk-${(chunk as TakeGroup).id}`
                          : `paragraph-chunk-${
                              (chunk as Word[])[0].originalIndex
                            }-${(chunk as Word[])[0].pasteKey}`
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
                      partialSelectState={partialSelectState}
                      setPartialSelectState={setPartialSelectState}
                      isMouseDown={isMouseDown}
                    />
                  ),
                  acc: isTakeGroup(chunk)
                    ? acc +
                      getTakeGroupLength(
                        chunk as TakeGroup,
                        transcription.words
                      )
                    : acc + (chunk as Word[]).length,
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
