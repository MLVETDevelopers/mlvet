import styled from '@emotion/styled';
import { Box, ClickAwayListener } from '@mui/material';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IndexRange, Transcription } from 'sharedTypes';
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
import RestorePopover from './RestorePopover';

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
  const [popperToggled, setPopperToggled] = useState<boolean | null>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popperText, setPopperText] = useState<string | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const editWord = useSelector((store: ApplicationStore) => store.editWord);

  const blockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setWidth(
      blockRef.current?.offsetWidth ? blockRef.current.offsetWidth : null
    );
  }, []);

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

  const onMarkerClick = (
    restoreIndexRange: IndexRange,
    element: HTMLElement
  ) => {
    setPopperToggled(true);
    console.log('setting popper');
    setAnchorEl(element);
    setPopperText(
      'Today is a recap on what we`ve done so far on all the groups - this is an opportunity if there are any roadblocks, and we will have a retrospective, and any questions for research proposal/presentation'
    );
  };

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
        <TranscriptionBox id="transcription-content" ref={blockRef}>
          {transcription.words.map((word, index) => (
            <WordAndSpaceContainer
              key={`container-${word.originalIndex}-${word.pasteKey}`}
            >
              {popperToggled && (
                <RestorePopover
                  text={popperText || ''}
                  anchorEl={anchorEl}
                  onClickAway={() => {
                    setPopperToggled(false);
                  }}
                  width={width}
                  transcriptionBlockRef={blockRef}
                />
              )}
              {word.deleted ? (
                <EditMarker
                  key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
                  transcription={transcription}
                  word={word}
                  index={index}
                  isSelected={selectionSet.has(index)}
                  onMarkerClick={onMarkerClick}
                />
              ) : (
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
                      isBetweenHighlightedWords={false}
                    />
                  )}
                </Fragment>
              )}
            </WordAndSpaceContainer>
          ))}
        </TranscriptionBox>
      )}
    </WordDragManager>
  );
};

export default TranscriptionBlock;
