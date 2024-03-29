import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import {
  CtrlFindSelectionState,
  IndexRange,
  Transcription,
  Word,
} from 'sharedTypes';
import React, {
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { EditWordState } from 'renderer/store/sharedHelpers';
import colors from 'renderer/colors';
import { isIndexInRange, isIndexInRanges } from 'renderer/utils/range';
import { makeSelectTake } from 'renderer/store/takeGroups/ops/selectTake';
import dispatchOp from 'renderer/store/dispatchOp';
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
    left: '-16px',

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
  ctrlFSelection: CtrlFindSelectionState;
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
  ctrlFSelection,
  onWordMouseDown,
  onWordMouseEnter,
  transcriptionIndex,
  isLast,
  isFirstTimeOpen,
  setIsFirstTimeOpen,
  transcription,
  ...passThroughProps
}: TakeComponentProps) => {
  const [currentTakeHeight, setCurrentTakeHeight] = useState<number>(0);
  const takeRef = useRef<HTMLDivElement>(null);

  const onSelectTake = useCallback(() => {
    const { takeInfo } = takeWords[0];
    if (!takeInfo) {
      return;
    }

    const takeGroup = transcription.takeGroups.find(
      (tg) => tg.id === takeInfo.takeGroupId
    );

    if (!takeGroup) {
      return;
    }

    // only makes action if the selection has changed
    if (
      takeGroup.activeTakeIndex !== takeInfo.takeIndex ||
      !takeGroup.takeSelected
    ) {
      dispatchOp(makeSelectTake(takeInfo, takeGroup));
    }

    if (!isFirstTimeOpen && isActive) {
      setIsTakeGroupOpened(false);
    }
  }, [
    takeWords,
    transcription.takeGroups,
    isFirstTimeOpen,
    isActive,
    setIsTakeGroupOpened,
  ]);

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

  const numberedButton =
    !isFirstTimeOpen && isTakeGroupOpened ? (
      <Avatar
        onClick={onSelectTake}
        sx={{
          height: 20,
          width: 20,
          fontSize: 12,
          color: colors.grey[700],
          backgroundColor: isActive ? colors.yellow[500] : colors.grey[400],
          display: 'flex',
          position: 'absolute',
          left: '-30px',
          transform: 'translateY(2px)',
          cursor: 'pointer',
        }}
      >
        {takeIndex + 1}
      </Avatar>
    ) : null;

  const TakeWords = takeWords.map((word, index, words) => {
    const wordIndex = transcriptionIndex + index;

    // Using wordIndex will not work with takes as 'words' will not
    // equal the entire transcription words, only the take words

    return (
      <WordOuterComponent
        key={`word-outer-${word.originalIndex}-${word.pasteKey}`}
        word={word}
        prevWord={wordIndex > 0 ? words[wordIndex - 1] : null}
        nextWord={wordIndex < words.length - 1 ? words[wordIndex + 1] : null}
        index={wordIndex}
        isPlaying={nowPlayingWordIndex === wordIndex}
        isPrevWordSelected={isIndexInRange(selection, wordIndex - 1)}
        isSelected={isIndexInRange(selection, wordIndex)}
        isNextWordSelected={isIndexInRange(selection, wordIndex + 1)}
        isPrevCtrlFSelected={isIndexInRanges(
          ctrlFSelection.indexRanges,
          wordIndex - 1
        )}
        isCtrlFSelected={isIndexInRanges(ctrlFSelection.indexRanges, wordIndex)}
        isNextCtrlFSelected={isIndexInRanges(
          ctrlFSelection.indexRanges,
          wordIndex + 1
        )}
        isCtrlFSelectedIndex={
          ctrlFSelection.maxIndex > 0
            ? isIndexInRange(
                ctrlFSelection.indexRanges[ctrlFSelection.selectedIndex],
                wordIndex
              )
            : false
        }
        onMouseDown={onWordMouseDown}
        onMouseEnter={onWordMouseEnter}
        isInInactiveTake={!(isActive || isTakeGroupOpened) && !isFirstTimeOpen}
        transcriptionLength={words.length}
        {...passThroughProps}
      />
    );
  });

  useLayoutEffect(() => {
    if (takeRef && takeRef.current?.clientHeight) {
      setCurrentTakeHeight(takeRef.current.clientHeight);
    }
  }, [takeRef.current?.clientHeight, isTakeGroupOpened]);

  return (
    <>
      <TakeWrapper className="take" onClick={onClick}>
        <CustomRowStack
          sx={{ justifyContent: 'flex-start', paddingLeft: '4px', gap: '4px' }}
        >
          {isTakeGroupOpened || isActive ? (
            <>
              {numberedButton}
              <SquareBracket
                isLast={isLast}
                isTakeGroupOpened={isTakeGroupOpened}
                takeHeight={currentTakeHeight}
              />
              {isTakeGroupOpened || isActive ? (
                <CustomRowStack flexWrap="wrap" ref={takeRef}>
                  {TakeWords}
                </CustomRowStack>
              ) : null}
            </>
          ) : null}
        </CustomRowStack>
      </TakeWrapper>
    </>
  );
};

export default React.memo(TakeComponent);
