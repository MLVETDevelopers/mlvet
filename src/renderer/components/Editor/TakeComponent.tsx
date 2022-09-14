import styled from '@emotion/styled';
import { Avatar, Box, Stack } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { useDispatch } from 'react-redux';
import { selectTake } from 'renderer/store/takeGroups/actions';
import { TakeInfo, Transcription, Word } from 'sharedTypes';
import React, { RefObject, useCallback, useMemo } from 'react';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';
import SquareBracket from './SquareBracket';
import { CustomRowStack } from '../CustomStacks';

const makeTakeWrapper = (
  isTakeGroupOpened: boolean,
  isActive: boolean,
  isFirstTimeOpen: boolean
) =>
  styled(Box)({
    borderColor: isTakeGroupOpened && isActive ? '#FFB355' : '#ABA9A9',
    opacity: isActive || isFirstTimeOpen ? 1 : 0.5,
    position: 'relative',
    left: '20px',

    '&:hover': {
      borderColor: '#FFB355',
      cursor: 'pointer',
      opacity: isActive ? 1 : 0.8,
    },
  });

interface TakePassThroughProps {
  transcription: Transcription;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  setPlaybackTime: (time: number) => void;
  otherSelectionSets: Record<ClientId, Set<number>>;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouseThrottled: MousePosition | null;
  editWord: EditWordState;
}

interface TakeComponentProps extends TakePassThroughProps {
  takeWords: Word[];
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  setIsTakeGroupOpened: (isOpen: boolean) => void;
  mousePosition: MousePosition | null;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<number>;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: (wordIndex: number) => void;
  transcriptionIndex: number;
  isLast: boolean;
  isFirstTimeOpen: boolean;
  setIsFirstTimeOpen: (isFirstTimeOpen: boolean) => void;
}

const TakeComponent = ({
  takeWords,
  takeIndex,
  isActive,
  isTakeGroupOpened,
  setIsTakeGroupOpened,
  mousePosition,
  nowPlayingWordIndex,
  selectionSet,
  onWordMouseDown,
  onWordMouseMove,
  transcriptionIndex,
  isLast,
  isFirstTimeOpen,
  setIsFirstTimeOpen,
  ...passThroughProps
}: TakeComponentProps) => {
  const dispatch = useDispatch();

  const onSelectTake = useCallback(() => {
    dispatch(selectTake(takeWords[0].takeInfo as TakeInfo));
    if (!isFirstTimeOpen && isActive) {
      setIsTakeGroupOpened(false);
    }
  }, [dispatch, takeWords, isFirstTimeOpen, isActive, setIsTakeGroupOpened]);

  const TakeWrapper = useMemo(
    () => makeTakeWrapper(isTakeGroupOpened, isActive, isFirstTimeOpen),
    [isTakeGroupOpened, isActive, isFirstTimeOpen]
  );

  const onClick = useCallback(() => {
    if (isActive && !isTakeGroupOpened) {
      setIsTakeGroupOpened(true);
    } else {
      onSelectTake();
      setIsFirstTimeOpen(false);
    }
  }, [
    isActive,
    isTakeGroupOpened,
    setIsTakeGroupOpened,
    onSelectTake,
    setIsFirstTimeOpen,
  ]);

  return (
    <>
      <TakeWrapper className="take" onClick={onClick}>
        <CustomRowStack sx={{ justifyContent: 'flex-start' }}>
          {isTakeGroupOpened || isActive ? (
            <>
              {!isFirstTimeOpen && isTakeGroupOpened && (
                <Avatar
                  onClick={onSelectTake}
                  sx={{
                    height: 22,
                    width: 22,
                    fontSize: 12,
                    color: '#1D201F',
                    backgroundColor: isActive ? '#FFB355' : '#ABA9A9',
                    display: 'flex',
                    position: 'absolute',
                    left: '-30px',
                    transform: 'translateY(2px)',
                    cursor: 'pointer',
                  }}
                >
                  {takeIndex + 1}
                </Avatar>
              )}
              <SquareBracket
                isLast={isLast}
                isTakeGroupOpened={isTakeGroupOpened}
              />
              {takeWords.map((word, index, words) => {
                const wordIndex = transcriptionIndex + index;
                return (
                  <WordOuterComponent
                    key={`word-outer-${word.originalIndex}-${word.pasteKey}`}
                    word={word}
                    prevWord={wordIndex > 0 ? words[wordIndex - 1] : null}
                    nextWord={
                      wordIndex < words.length - 1 ? words[wordIndex + 1] : null
                    }
                    index={wordIndex}
                    mouse={mousePosition}
                    isPlaying={nowPlayingWordIndex === wordIndex}
                    isSelected={selectionSet.has(wordIndex)}
                    isPrevWordSelected={selectionSet.has(wordIndex - 1)}
                    isNextWordSelected={selectionSet.has(wordIndex + 1)}
                    onMouseDown={onWordMouseDown}
                    onMouseMove={onWordMouseMove}
                    isInInactiveTake={
                      !(isActive || isTakeGroupOpened) && !isFirstTimeOpen
                    }
                    transcriptionLength={words.length}
                    {...passThroughProps}
                  />
                );
              })}
            </>
          ) : null}
        </CustomRowStack>
      </TakeWrapper>
    </>
  );
};

export default React.memo(TakeComponent);
