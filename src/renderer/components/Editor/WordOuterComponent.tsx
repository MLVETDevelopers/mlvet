import { Box, styled } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { ClientId } from 'collabTypes/collabShadowTypes';
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
  isSelected: boolean;
  isPrevWordSelected: boolean;
  isNextWordSelected: boolean;
  otherSelectionSets: Record<ClientId, Set<number>>;
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
  isInInactiveTake: boolean;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  isPlaying: boolean;
  setPlaybackTime: (time: number) => void;
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
  isSelected,
  isPrevWordSelected,
  isNextWordSelected,
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
  isPlaying,
  isInInactiveTake,
  popoverWidth,
  transcriptionBlockRef,
  setPlaybackTime,
}: WordOuterComponentProps) => {
  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

  const collab = useSelector((store: ApplicationStore) => store.collab);

  const otherClients = useMemo(() => {
    if (collab === null || collab.sessionCode === null) {
      return [];
    }

    return collab.clients.filter((client) => client.id !== collab.ownClientId);
  }, [collab]);

  const selectedByClientWithIndex = useMemo(() => {
    if (isSelected) {
      return null;
    }

    const clientIndex = otherClients.findIndex(
      (client) =>
        client.id in otherSelectionSets &&
        otherSelectionSets[client.id].has(index)
    );

    return clientIndex === -1 ? null : clientIndex;
  }, [otherSelectionSets, isSelected, index, otherClients]);

  const [isSelectedByAnotherClientLeftCap, isSelectedByAnotherClientRightCap] =
    useMemo(() => {
      if (isSelected || selectedByClientWithIndex === null) {
        return [false, false];
      }

      const left = index - 1;
      const right = index + 1;

      return [left, right].map(
        (testIndex) =>
          !otherSelectionSets[otherClients[selectedByClientWithIndex].id].has(
            testIndex
          )
      );
    }, [
      otherSelectionSets,
      isSelected,
      index,
      otherClients,
      selectedByClientWithIndex,
    ]);

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
          selectedByClientWithIndex={selectedByClientWithIndex}
          popoverWidth={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
        />
      ) : (
        <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
          <WordSpace
            key={`space-${word.originalIndex}-${word.pasteKey}`}
            isDropMarkerActive={dragState !== null && dropBeforeIndex === index}
            isBetweenHighlightedWords={isSelected && isPrevWordSelected}
            highlightedByClientWithIndex={
              isSelectedByAnotherClientLeftCap
                ? null
                : selectedByClientWithIndex
            }
          />
          <WordComponent
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            isPlaying={isPlaying}
            isSelected={isSelected}
            isSelectedLeftCap={isSelected && !isPrevWordSelected}
            isSelectedRightCap={isSelected && !isNextWordSelected}
            selectedByClientWithIndex={selectedByClientWithIndex}
            isSelectedByAnotherClientLeftCap={isSelectedByAnotherClientLeftCap}
            isSelectedByAnotherClientRightCap={
              isSelectedByAnotherClientRightCap
            }
            text={word.word}
            confidence={word.confidence ?? 1}
            index={index}
            onMouseDown={onWordMouseDown}
            onMouseMove={onWordMouseMove}
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
            setPlaybackTime={setPlaybackTime}
            outputStartTime={word.outputStartTime}
          />
          {index === transcription.words.length - 1 && (
            <WordSpace
              key="space-end"
              isDropMarkerActive={
                dragState !== null &&
                dropBeforeIndex === transcription.words.length
              }
              isBetweenHighlightedWords={false}
              highlightedByClientWithIndex={null}
            />
          )}
        </Fragment>
      )}
    </WordAndSpaceContainer>
  );
};

export default WordOuterComponent;
