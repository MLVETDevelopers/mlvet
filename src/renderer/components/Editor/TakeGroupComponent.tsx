/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';
import BlockIcon from '@mui/icons-material/Block';
import { Box, Stack } from '@mui/material';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, { RefObject, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import colors from 'renderer/colors';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { deleteTakeGroup } from 'renderer/store/takeGroups/actions';
import { IndexRange, TakeGroup, Transcription, Word } from 'sharedTypes';
import {
  getWordElementIdFromClick,
  isEventInElement,
  isWordInTake,
  transcriptionContentId,
} from 'renderer/utils/ui';
import { clearRangeOverride } from 'renderer/store/playback/action';
import { useEventListener } from 'renderer/utils/hooks';
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
  const takeGroupId = 'take-group';

  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(
    !takeGroup.takeSelected
  );
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(
    !takeGroup.takeSelected
  );
  const [showUngroupModal, setShowUngroupModal] = useState(false);
  const dispatch = useDispatch();

  const ungroupTakesModalOpen = () => {
    setShowUngroupModal(true);
  };

  const handleModalClose = () => {
    setShowUngroupModal(false);
  };

  const ungroupTakes = () => {
    dispatch(deleteTakeGroup(takeGroup.id));
    handleModalClose();
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

  const onClickAway = (event: Event) => {
    const isInTranscriptionContent = isEventInElement(
      event,
      transcriptionContentId
    );
    const isInTakeGroup = isEventInElement(event, takeGroupId);
    let isWordFromTake = false;

    const wordIdFromClick = getWordElementIdFromClick(event);

    isWordFromTake = isWordInTake(
      wordIdFromClick,
      takeWordsPerTake[takeGroup.activeTakeIndex]
    );

    if (isInTranscriptionContent && !isInTakeGroup && !isWordFromTake) {
      dispatch(clearRangeOverride());
      setIsTakeGroupOpened(false);
    }
  };

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

  useEventListener('mouseup', onClickAway);

  return (
    <Box id={takeGroupId}>
      <CustomColumnStack
        sx={{
          marginTop: '10px',
          marginBottom: !isFirstTimeOpen && isTakeGroupOpened ? '35px' : '15px',
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
  );
};

export default React.memo(TakeGroupComponent);
