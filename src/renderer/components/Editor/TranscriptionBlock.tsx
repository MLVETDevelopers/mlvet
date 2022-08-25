import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../../store/sharedHelpers';
import colors from '../../colors';
import WordComponent from './WordComponent';
import WordDragManager from './WordDragManager';
import { selectionCleared } from '../../store/selection/actions';
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
  const selectionArray = useSelector(
    (store: ApplicationStore) => store.selection
  );

  const selectionSet = useMemo(() => new Set(selectionArray), [selectionArray]);

  const dispatch = useDispatch();

  const clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void = (dragSelectAnchor, clearAnchor) => {
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
          id="transcription-content"
          onMouseUp={() =>
            clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null))
          }
        >
          {transcription.words.map((word, index) => (
            <WordAndSpaceContainer
              key={`container-${word.originalIndex}-${word.pasteKey}`}
            >
              {word.deleted ? (
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
