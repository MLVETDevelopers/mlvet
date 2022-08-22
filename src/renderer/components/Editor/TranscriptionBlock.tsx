import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeCorrectWord } from 'renderer/store/transcriptionWords/ops/correctWord';
import { editWordFinished } from 'renderer/store/editWord/actions';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import Word from './Word';
import WordDragManager from './WordDragManager';
import { selectionCleared } from '../../store/selection/actions';
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
    if (
      editWord !== null &&
      editWord.text !== '' &&
      editWord.text !== transcription.words[editWord.index].word
    ) {
      dispatchOp(
        makeCorrectWord(transcription.words, editWord.index, editWord.text)
      );
    }

    dispatch(editWordFinished());
  };

  const clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void = (dragSelectAnchor, clearAnchor) => {
    // If there is an edit in progress, save and close it
    submitWordEdit();

    if (dragSelectAnchor == null) {
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
          onMouseUp={() =>
            clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null))
          }
        >
          {transcription.words.map((word, index) =>
            word.deleted ? null : (
              <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
                <WordSpace
                  key={`space-${word.originalIndex}-${word.pasteKey}`}
                  isDropMarkerActive={
                    dragState !== null && dropBeforeIndex === index
                  }
                />
                <Word
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
