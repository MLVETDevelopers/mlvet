import { Box, styled } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { Fragment, RefObject, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { Word, Transcription } from 'sharedTypes';
import EditMarker from './EditMarker';
import WordComponent from './WordComponent';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordSpace from './WordSpace';

interface WordOuterComponentProps {
  word: Word;
  index: number;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  selectionSet: Set<number>;
  otherSelectionSets: Set<number>[];
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouse: MousePosition | null;
  mouseThrottled: MousePosition | null;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
  isInInactiveTake: boolean;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const WordAndSpaceContainer = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
});

const WordOuterComponent = ({
  word,
  index,
  transcription,
  seekToWord,
  selectionSet,
  otherSelectionSets,
  onWordMouseDown,
  onWordMouseMove,
  dragState,
  isWordBeingDragged,
  mouse,
  mouseThrottled,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  submitWordEdit,
  editWord,
  nowPlayingWordIndex,
  isInInactiveTake,
  popoverWidth,
  transcriptionBlockRef,
}: WordOuterComponentProps) => {
  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

  const isSelected = useMemo(
    () => selectionSet.has(index),
    [selectionSet, index]
  );

  const isSelectedByAnotherClient = useMemo(
    () =>
      !isSelected &&
      Object.values(otherSelectionSets).some((otherSelectionSet) =>
        otherSelectionSet.has(index)
      ),
    [otherSelectionSets, isSelected, index]
  );
  const isSelectedByAnotherClientLeftCap = useMemo(
    () =>
      !isSelected &&
      Object.values(otherSelectionSets).every(
        (otherSelectionSet) => !otherSelectionSet.has(index - 1)
      ),
    [otherSelectionSets, isSelected, index]
  );
  const isSelectedByAnotherClientRightCap = useMemo(
    () =>
      !isSelected &&
      Object.values(otherSelectionSets).every(
        (otherSelectionSet) => !otherSelectionSet.has(index + 1)
      ),
    [otherSelectionSets, isSelected, index]
  );

  return (
    <WordAndSpaceContainer
      key={`container-${word.originalIndex}-${word.pasteKey}`}
    >
      {word.deleted ? (
        <EditMarker
          key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
          transcription={transcription}
          word={word}
          index={index}
          isSelected={isSelected}
          isSelectedByAnotherClient={isSelectedByAnotherClient}
          popoverWidth={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
        />
      ) : (
        <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
          <WordSpace
            key={`space-${word.originalIndex}-${word.pasteKey}`}
            isDropMarkerActive={dragState !== null && dropBeforeIndex === index}
            isBetweenHighlightedWords={
              selectionSet.has(index - 1) && selectionSet.has(index)
            }
            isBetweenOtherClientHighlightedWords={
              !isSelectedByAnotherClientLeftCap && isSelectedByAnotherClient
            }
          />
          <WordComponent
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            seekToWord={() => seekToWord(index)}
            isPlaying={index === nowPlayingWordIndex}
            isSelected={isSelected}
            isSelectedLeftCap={
              selectionSet.has(index) && !selectionSet.has(index - 1)
            }
            isSelectedRightCap={
              selectionSet.has(index) && !selectionSet.has(index + 1)
            }
            isSelectedByAnotherClient={isSelectedByAnotherClient}
            isSelectedByAnotherClientLeftCap={isSelectedByAnotherClientLeftCap}
            isSelectedByAnotherClientRightCap={
              isSelectedByAnotherClientRightCap
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
            isInInactiveTake={isInInactiveTake}
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
              isBetweenOtherClientHighlightedWords={false}
            />
          )}
        </Fragment>
      )}
    </WordAndSpaceContainer>
  );
};

export default WordOuterComponent;
