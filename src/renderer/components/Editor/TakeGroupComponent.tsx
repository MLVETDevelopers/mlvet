/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';
import BlockIcon from '@mui/icons-material/Block';
import { Stack } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { TakeGroup, Transcription, Word } from 'sharedTypes';
import SquareBracket from './SquareBracket';
import TakeComponent from './TakeComponent';
import { DragState, WordMouseHandler } from './WordDragManager';

const CustomStack = styled(Stack)({ width: '100%' });

const CustomColumnStack = styled(CustomStack)({ flexDirection: 'column' });

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
});

export interface TranscriptionPassThroughProps {
  dragState: DragState;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouseThrottled: MousePosition | null;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>;
  cancelDrag: () => void;
  editWord: EditWordState;
  submitWordEdit: () => void;
  otherSelectionSets: Record<ClientId, Set<number>>;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  setPlaybackTime: (time: number) => void;
}

interface TakeGroupComponentProps extends TranscriptionPassThroughProps {
  takeGroup: TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: (wordIndex: number) => void;
  mousePosition: MousePosition | null;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<any>;
  transcription: Transcription;
}

const TakeGroupComponent = ({
  takeGroup,
  chunkIndex,
  onWordMouseDown,
  onWordMouseMove,
  isWordBeingDragged,
  mousePosition,
  nowPlayingWordIndex,
  selectionSet,
  transcription,
  ...passThroughProps
}: TakeGroupComponentProps) => {
  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(false);

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
      <CustomRowStack sx={{ justifyContent: 'flex-start' }}>
        <SquareBracket isLast={takeIndex === takeWordsPerTake.length - 1} />
        <TakeComponent
          key={`take-${takeGroup.id}-${takeIndex}`}
          takeWords={takeWords}
          takeIndex={takeIndex}
          isActive={takeIndex === takeGroup.activeTakeIndex}
          isTakeGroupOpened={isTakeGroupOpened}
          setIsTakeGroupOpened={setIsTakeGroupOpened}
          onWordMouseDown={onWordMouseDown}
          onWordMouseMove={onWordMouseMove}
          isWordBeingDragged={isWordBeingDragged}
          mousePosition={mousePosition}
          nowPlayingWordIndex={nowPlayingWordIndex}
          transcription={transcription}
          selectionSet={selectionSet}
          transcriptionIndex={transcriptionIndex}
          {...passThroughProps}
        />
      </CustomRowStack>
    );
  });

  return (
    <CustomColumnStack sx={{ marginTop: '10px', marginBottom: '10px' }}>
      <CustomRowStack sx={{ justifyContent: 'flex-end' }}>
        <BlockIcon />
      </CustomRowStack>
      {takes}
    </CustomColumnStack>
  );
};

export default React.memo(TakeGroupComponent);
