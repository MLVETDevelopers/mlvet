import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
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
import EditMarker from './EditMarker';

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
  const selectionArray = useSelector(
    (store: ApplicationStore) => store.selection
  );

  const editWord = useSelector((store: ApplicationStore) => store.editWord);

  const selectionSet = useMemo(
    () => (editWord === null ? new Set(selectionArray) : new Set()),
    [selectionArray, editWord]
  );

  const dispatch = useDispatch();

  const submitWordEdit: () => void = () => {
    if (editWord === null) {
      return;
    }

    const { index } = editWord;

    // Clear the selection to start with - the word might be re-selected later
    dispatch(selectionCleared());

    if (editWord.text === '') {
      // If the user edits a word to be empty, treat this as a delete action
      dispatchOp(makeDeleteSelection([rangeLengthOne(index)]));
    } else if (editWord.text === transcription.words[index].word) {
      // If the user edits a word but leaves it unchanged, just select it without
      // dispatching an update to the word itself
      dispatch(selectionRangeAdded(rangeLengthOne(index)));
    } else {
      // If the user edits a word, update the word then select it
      dispatchOp(makeCorrectWord(transcription.words, index, editWord.text));
      dispatch(selectionRangeAdded(rangeLengthOne(index)));
    }

    // Mark the edit as over
    dispatch(editWordFinished());
  };

  const clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void = (dragSelectAnchor, clearAnchor) => {
    // If there is an edit in progress, save and close it
    if (editWord !== null) {
      submitWordEdit();
    } else if (dragSelectAnchor == null) {
      dispatch(selectionCleared());
    } else {
      clearAnchor();
    }
  };

  return (
    <WordDragManager>
      {(
        onWordMouseDown,
        onWordMouseMove,
        dragState,
        isWordBeingDragged,
        mouse,
        mouseThrottled,
        dropBeforeIndex,
        setDropBeforeIndex,
        cancelDrag,
        dragSelectAnchor,
        setDragSelectAnchor
      ) => (
        <TranscriptionBox
          id="transcription-content"
          onMouseUp={() =>
            clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null))
          }
        >
          {transcription.words.map((word, index) =>
            word.deleted ? (
              <EditMarker
                key={word.originalIndex}
                transcription={transcription}
                word={word}
                index={index}
              />
            ) : (
              <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
                <WordSpace
                  key={`space-${word.originalIndex}-${word.pasteKey}`}
                  isDropMarkerActive={
                    dragState !== null && dropBeforeIndex === index
                  }
                />
                <WordComponent
                  key={`word-${word.originalIndex}-${word.pasteKey}`}
                  seekToWord={() => seekToWord(index)}
                  isPlaying={index === nowPlayingWordIndex}
                  isSelected={selectionSet.has(index)}
                  text={word.word}
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
                />
                {index === transcription.words.length - 1 && (
                  <WordSpace
                    key="space-end"
                    isDropMarkerActive={
                      dragState !== null &&
                      dropBeforeIndex === transcription.words.length
                    }
                  />
                )}
              </Fragment>
            )
          )}
        </TranscriptionBox>
      )}
    </WordDragManager>
  );
};

export default TranscriptionBlock;
