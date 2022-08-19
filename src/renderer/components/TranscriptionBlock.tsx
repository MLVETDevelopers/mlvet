import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, RefObject, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';
import { selectionCleared } from '../store/selection/actions';
import DragManager, { RenderTranscription } from './WordDragManager';
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
  containerRef: RefObject<HTMLDivElement>;
}

const TranscriptionBlock = ({
  seekToWord,
  transcription,
  nowPlayingWordIndex,
  containerRef,
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

  const renderTranscription: RenderTranscription = (
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
  );

  return (
    <DragManager
      renderTranscription={renderTranscription}
      containerRef={containerRef}
    />
  );
};

export default TranscriptionBlock;
