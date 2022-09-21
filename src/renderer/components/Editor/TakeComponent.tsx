import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { selectTake } from 'renderer/store/takeGroups/actions';
import { IndexRange, TakeInfo, Transcription, Word } from 'sharedTypes';
import React, { RefObject, useCallback, useMemo } from 'react';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { EditWordState } from 'renderer/store/sharedHelpers';
import colors from 'renderer/colors';
import { isIndexInRange } from 'renderer/utils/range';
import { PartialSelectState, WordMouseHandler } from './DragSelectManager';
import WordOuterComponent from './WordOuterComponent';
import SquareBracket from './SquareBracket';
import { CustomRowStack } from '../CustomStacks';

const makeTakeWrapper = (
  isTakeGroupOpened: boolean,
  isActive: boolean,
  isFirstTimeOpen: boolean
) =>
  styled(Box)({
    borderColor:
      isTakeGroupOpened && isActive ? colors.yellow[500] : colors.grey[400],
    opacity: isActive || isFirstTimeOpen ? 1 : 0.5,
    position: 'relative',
    left: '20px',

    '&:hover': {
      borderColor: colors.yellow[500],
      cursor: 'pointer',
      opacity: isActive ? 1 : 0.8,
    },
  });

interface TakePassThroughProps {
  transcription: Transcription;
  submitWordEdit: () => void;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  setPlaybackTime: (time: number) => void;
  otherSelections: Record<ClientId, IndexRange>;
  editWord: EditWordState;
  partialSelectState: PartialSelectState | null;
  setPartialSelectState: React.Dispatch<
    React.SetStateAction<PartialSelectState | null>
  >;
  isMouseDown: boolean;
}

interface TakeComponentProps extends TakePassThroughProps {
  takeWords: Word[];
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  setIsTakeGroupOpened: (isOpen: boolean) => void;
  nowPlayingWordIndex: number | null;
  selection: IndexRange;
  onWordMouseDown: WordMouseHandler;
  onWordMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void;
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
  nowPlayingWordIndex,
  selection,
  onWordMouseDown,
  onWordMouseEnter,
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
                    color: colors.grey[700],
                    backgroundColor: isActive
                      ? colors.yellow[500]
                      : colors.grey[400],
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
                    isPlaying={nowPlayingWordIndex === wordIndex}
                    isPrevWordSelected={isIndexInRange(
                      selection,
                      wordIndex - 1
                    )}
                    isSelected={isIndexInRange(selection, wordIndex)}
                    isNextWordSelected={isIndexInRange(
                      selection,
                      wordIndex + 1
                    )}
                    onMouseDown={onWordMouseDown}
                    onMouseEnter={onWordMouseEnter}
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
