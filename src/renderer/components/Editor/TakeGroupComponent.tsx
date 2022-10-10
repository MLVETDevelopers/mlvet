/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';
import BlockIcon from '@mui/icons-material/Block';
import { Box, ClickAwayListener, Stack } from '@mui/material';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import colors from 'renderer/colors';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { IndexRange, TakeGroup, Transcription, Word } from 'sharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeDeleteTakeGroup } from 'renderer/store/takeGroups/ops/deleteTakeGroup';
import TakeComponent from './TakeComponent';
import UngroupTakesModal from './UngroupTakesModal';
import { PartialSelectState, WordMouseHandler } from './DragSelectManager';

const CustomStack = styled(Stack)({ width: '100%' });

const CustomColumnStack = styled(CustomStack)({ flexDirection: 'column' });

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
});

const UngroupTakes = styled(BlockIcon)({
  display: 'flex',
  position: 'absolute',
  left: '-46px',
  marginTop: '40px',
  width: '22px',
  height: '22px',
  color: colors.grey[500],

  '&:hover': {
    color: colors.grey[300],
  },
});

export interface TranscriptionPassThroughProps {
  editWord: EditWordState;
  submitWordEdit: () => void;
  otherSelections: Record<ClientId, IndexRange>;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  setPlaybackTime: (time: number) => void;
  partialSelectState: PartialSelectState | null;
  setPartialSelectState: React.Dispatch<
    React.SetStateAction<PartialSelectState | null>
  >;
  isMouseDown: boolean;
}

interface TakeGroupComponentProps extends TranscriptionPassThroughProps {
  takeGroup: TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void;
  nowPlayingWordIndex: number | null;
  selection: IndexRange;
  transcription: Transcription;
}

const TakeGroupComponent = ({
  takeGroup,
  chunkIndex,
  onWordMouseDown,
  onWordMouseEnter,
  nowPlayingWordIndex,
  selection,
  transcription,
  ...passThroughProps
}: TakeGroupComponentProps) => {
  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(
    !takeGroup.takeSelected
  );
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(
    !takeGroup.takeSelected
  );
  const [showUngroupModal, setShowUngroupModal] = useState(false);

  const ungroupTakesModalOpen = () => {
    setShowUngroupModal(true);
  };

  const handleModalClose = () => {
    setShowUngroupModal(false);
  };

  const ungroupTakes = () => {
    const getTakeRanges = (): IndexRange[] => {
      const { words } = transcription;

      // Make a list of only the words in this take group,
      // keeping track of what their indices in the current transcription were
      const wordsInTakeGroup: {
        word: Word;
        indexInTranscription: number;
      }[] = words
        // Keep track of the indices in the transcription so that we can use them later
        .map((word, i) => ({ word, indexInTranscription: i }))
        // Filter to only include words in the current take group
        .filter(({ word }) => word.takeInfo?.takeGroupId === takeGroup.id);

      // Extract a list of take ranges from the word list we just made
      const takeRanges = wordsInTakeGroup.reduce<IndexRange[]>(
        (rangesSoFar, word, index) => {
          const isLastWordInTakeGroup = index === wordsInTakeGroup.length - 1;
          const nextWord = isLastWordInTakeGroup
            ? null
            : wordsInTakeGroup[index + 1];
          const isLastWordInTake =
            nextWord?.word.takeInfo?.takeIndex !==
            word.word.takeInfo?.takeIndex;

          // If we're in a new take compared to the previous word, or this is the last
          // word in the take group, 'push' the current take to the list of takes.
          if (isLastWordInTakeGroup || isLastWordInTake) {
            // Find what the startIndex of the take should be. Since takes are always
            // next to each other, the start index will just be the endIndex of the previous
            // take range, or if this is the first take in the group, it will be the index of
            // the first word in the take.
            const startIndex =
              rangesSoFar.length > 0
                ? rangesSoFar[rangesSoFar.length - 1].endIndex
                : wordsInTakeGroup[0].indexInTranscription;

            // Add a new range from startIndex up to the current word's index in the current
            // transcription, plus one as the end index is exclusive
            return rangesSoFar.concat([
              {
                startIndex,
                endIndex: word.indexInTranscription + 1,
              },
            ]);
          }

          // If this isn't the last word or a new take, just return the list of ranges unmodified
          return rangesSoFar;
        },
        []
      );

      return takeRanges;
    };

    dispatchOp(makeDeleteTakeGroup(takeGroup, getTakeRanges()));
    handleModalClose();
  };

  const clickAway = () => {
    if (!isFirstTimeOpen) {
      setIsTakeGroupOpened(false);
    }
  };

  const wordsInTakeGroup = useMemo(
    () =>
      transcription.words.filter(
        (word) => word.takeInfo?.takeGroupId === takeGroup.id
      ),
    [transcription, takeGroup]
  );

  /**
   * Word[][] where each inner array contains the list of words in a particular take
   */
  const takeWordsPerTake = useMemo(
    () =>
      wordsInTakeGroup.reduce((acc, curr) => {
        if (curr.takeInfo?.takeIndex === acc.length) {
          return acc.concat([[curr]]);
        }
        if (acc.length === 0) {
          return [[curr]];
        }
        return [
          ...acc.slice(0, acc.length - 1),
          acc[acc.length - 1].concat(curr),
        ];
      }, [] as Word[][]),
    [wordsInTakeGroup]
  );

  const takes = takeWordsPerTake.map((takeWords, takeIndex) => {
    // Index of the first word in the take, within the whole transcription
    const transcriptionIndex =
      chunkIndex +
      takeWordsPerTake
        .slice(0, takeIndex)
        .map((take) => take.length)
        .reduce((acc, curr) => acc + curr, 0);

    return (
      <TakeComponent
        key={`take-${takeGroup.id}-${takeIndex}`}
        takeWords={takeWords}
        takeIndex={takeIndex}
        isActive={takeIndex === takeGroup.activeTakeIndex}
        isTakeGroupOpened={isTakeGroupOpened}
        setIsTakeGroupOpened={setIsTakeGroupOpened}
        onWordMouseDown={onWordMouseDown}
        onWordMouseEnter={onWordMouseEnter}
        nowPlayingWordIndex={nowPlayingWordIndex}
        transcription={transcription}
        selection={selection}
        transcriptionIndex={transcriptionIndex}
        isLast={takeIndex === takeWordsPerTake.length - 1}
        isFirstTimeOpen={isFirstTimeOpen}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
        {...passThroughProps}
      />
    );
  });

  useEffect(() => {
    // when undoing the first take selection, it reverts back to the initial state
    setIsFirstTimeOpen(!takeGroup.takeSelected);
    if (!takeGroup.takeSelected) {
      setIsTakeGroupOpened(true);
    }
  }, [takeGroup.takeSelected]);

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <Box>
        <CustomColumnStack
          sx={{
            marginTop: '10px',
            marginBottom:
              !isFirstTimeOpen && isTakeGroupOpened ? '35px' : '15px',
          }}
        >
          {takes}
          <CustomRowStack
            position="relative"
            sx={{ justifyContent: 'flex-start' }}
          >
            {!isFirstTimeOpen && isTakeGroupOpened && (
              <UngroupTakes onClick={ungroupTakesModalOpen} />
            )}
          </CustomRowStack>
        </CustomColumnStack>
        <UngroupTakesModal
          isOpen={showUngroupModal}
          closeModal={handleModalClose}
          ungroupTakes={ungroupTakes}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default React.memo(TakeGroupComponent);
