/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';
import BlockIcon from '@mui/icons-material/Block';
import { Stack } from '@mui/material';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, { RefObject, useMemo, useState } from 'react';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { IndexRange, TakeGroup, Transcription, Word } from 'sharedTypes';
import TakeComponent from './TakeComponent';
import { PartialSelectState, WordMouseHandler } from './DragSelectManager';

const CustomStack = styled(Stack)({ width: '100%' });

const CustomColumnStack = styled(CustomStack)({ flexDirection: 'column' });

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
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
  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(true);

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

  return (
    <CustomColumnStack sx={{ marginTop: '10px', marginBottom: '10px' }}>
      <CustomRowStack sx={{ justifyContent: 'flex-end' }}>
        {!isFirstTimeOpen && isTakeGroupOpened && <BlockIcon />}
      </CustomRowStack>
      {takes}
    </CustomColumnStack>
  );
};

export default React.memo(TakeGroupComponent);
