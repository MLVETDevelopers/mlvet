import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeCorrectWord } from 'renderer/store/transcriptionWords/ops/correctWord';
import { editWordFinished } from 'renderer/store/editWord/actions';
import { makeDeleteSelection } from 'renderer/store/transcriptionWords/ops/deleteSelection';
import { rangeLengthOne } from 'renderer/utils/range';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import WordComponent from './WordComponent';
import WordDragManager from './WordDragManager';
import {
  selectionCleared,
  selectionRangeAdded,
} from '../../store/selection/actions';
import WordSpace from './WordSpace';

const TranscriptionBox = styled(Box)({
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

const WordAndSpaceContainer = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
});

interface Props {
  transcription: Transcription;
  nowPlayingWordIndex: number | null;
  seekToWord: (wordIndex: number) => void;
}

const TranscriptionBlock = ({
  seekToWord,
  transcription,
  nowPlayingWordIndex,
}: Props) => {
  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

  const editWord = useSelector((store: ApplicationStore) => store.editWord);

  const selectionArray = useSelector(
    (store: ApplicationStore) => store.selection
  );

  const selectionSet = useMemo(
    () => (editWord === null ? new Set(selectionArray) : new Set()),
    [selectionArray, editWord]
  );

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
      ) => (
        <TranscriptionBox id="transcription-content">
          {transcription.words.map((word, index) => (
            <WordAndSpaceContainer
              key={`container-${word.originalIndex}-${word.pasteKey}`}
            >
              <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
                <WordSpace
                  key={`space-${word.originalIndex}-${word.pasteKey}`}
                  isDropMarkerActive={
                    dragState !== null && dropBeforeIndex === index
                  }
                  isBetweenHighlightedWords={
                    selectionSet.has(index - 1) && selectionSet.has(index)
                  }
                />
                <WordComponent
                  key={`word-${word.originalIndex}-${word.pasteKey}`}
                  seekToWord={() => seekToWord(index)}
                  isPlaying={index === nowPlayingWordIndex}
                  isSelected={selectionSet.has(index)}
                  isSelectedLeftCap={
                    selectionSet.has(index) && !selectionSet.has(index - 1)
                  }
                  isSelectedRightCap={
                    selectionSet.has(index) && !selectionSet.has(index + 1)
                  }
                  text={word.word}
                  confidence={word.confidence ?? 1}
                  index={index}
                  onMouseDown={onWordMouseDown(index)}
                  onMouseMove={() => onWordMouseMove(index)}
                  dragState={dragState}
                  isBeingDragged={isWordBeingDragged(index)}
                  mouse={isWordBeingDragged(index) ? mouse : mouseThrottled}
                  isDropBeforeActive={dropBeforeIndex === index}
                  isDropAfterActive={dropBeforeIndex === index + 1}
                  setDropBeforeIndex={setDropBeforeIndex}
                  cancelDrag={cancelDrag}
                  submitWordEdit={submitWordEdit}
                  isBeingEdited={editWord?.index === index}
                  editText={editWord?.text ?? null}
                  isShowingConfidenceUnderlines={isShowingConfidenceUnderlines}
                />
                {index === transcription.words.length - 1 && (
                  <WordSpace
                    key="space-end"
                    isDropMarkerActive={
                      dragState !== null &&
                      dropBeforeIndex === transcription.words.length
                    }
                    isBetweenHighlightedWords={false}
                  />
                )}
              </Fragment>
            </WordAndSpaceContainer>
          ))}
        </TranscriptionBox>
      )}
    </WordDragManager>
  );
};

export default TranscriptionBlock;
