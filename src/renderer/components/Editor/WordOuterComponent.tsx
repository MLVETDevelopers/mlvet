import { Box, styled } from '@mui/material';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, { Fragment, RefObject, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore, EditWordState } from 'renderer/store/sharedHelpers';
import { Word } from 'sharedTypes';
import EditMarker from './EditMarker';
import WordComponent, { WordPassThroughProps } from './WordComponent';
import WordSpace from './WordSpace';

interface WordOuterComponentProps extends WordPassThroughProps {
  word: Word;
  prevWord: Word | null;
  nextWord: Word | null;
  index: number;
  isSelected: boolean;
  isPrevWordSelected: boolean;
  isNextWordSelected: boolean;
  otherSelectionSets: Record<ClientId, Set<number>>;
  editWord: EditWordState;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  transcriptionLength: number;
}

const WordAndSpaceContainer = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
});

const WordOuterComponent = ({
  word,
  index,
  prevWord,
  nextWord,
  isSelected,
  isPrevWordSelected,
  otherSelectionSets,
  editWord,
  popoverWidth,
  transcriptionBlockRef,
  isNextWordSelected,
  transcriptionLength,
  ...passThroughProps
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

  const confidence = useMemo(
    () => (isShowingConfidenceUnderlines ? word.confidence ?? 1 : 1),
    [isShowingConfidenceUnderlines, word]
  );

  return (
    <WordAndSpaceContainer
      key={`container-${word.originalIndex}-${word.pasteKey}`}
    >
      {word.deleted ? (
        <EditMarker
          key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
          word={word}
          prevWord={prevWord}
          nextWord={nextWord}
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
            isBetweenHighlightedWords={isSelected && isPrevWordSelected}
            highlightedByClientWithIndex={
              isSelectedByAnotherClientLeftCap
                ? null
                : selectedByClientWithIndex
            }
          />
          <WordComponent
            text={word.word}
            outputStartTime={word.outputStartTime}
            confidence={confidence}
            isBeingEdited={editWord?.index === index}
            editText={editWord?.text ?? null}
            isSelected={isSelected}
            selectedByClientWithIndex={selectedByClientWithIndex}
            isSelectedByAnotherClientLeftCap={isSelectedByAnotherClientLeftCap}
            isSelectedByAnotherClientRightCap={
              isSelectedByAnotherClientRightCap
            }
            index={index}
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            isSelectedLeftCap={isSelected && !isPrevWordSelected}
            isSelectedRightCap={isSelected && !isNextWordSelected}
            {...passThroughProps}
          />
          {index === transcriptionLength - 1 && (
            <WordSpace
              key="space-end"
              isBetweenHighlightedWords={false}
              highlightedByClientWithIndex={null}
            />
          )}
        </Fragment>
      )}
    </WordAndSpaceContainer>
  );
};

export default React.memo(WordOuterComponent);
