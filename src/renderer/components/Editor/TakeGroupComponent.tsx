/* eslint-disable react/no-array-index-key */

import { MousePosition } from '@react-hook/mouse-position';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { TakeGroup, Transcription, Word } from 'sharedTypes';
import TakeComponent from './TakeComponent';
import { WordMouseHandler, DragState } from './WordDragManager';

interface TakeGroupComponentProps {
  takeGroup: TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mousePosition: MousePosition | null;
  mouseThrottled: MousePosition | null;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>;
  cancelDrag: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  submitWordEdit: () => void;
  selectionSet: Set<any>;
}

const TakeGroupComponent = ({
  takeGroup,
  chunkIndex,
  onWordMouseDown,
  onWordMouseMove,
  dragState,
  isWordBeingDragged,
  mousePosition,
  mouseThrottled,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  editWord,
  nowPlayingWordIndex,
  transcription,
  seekToWord,
  submitWordEdit,
  selectionSet,
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

  console.log(takeGroup);

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
        onWordMouseMove={onWordMouseMove}
        dragState={dragState}
        isWordBeingDragged={isWordBeingDragged}
        mousePosition={mousePosition}
        mouseThrottled={mouseThrottled}
        dropBeforeIndex={dropBeforeIndex}
        setDropBeforeIndex={setDropBeforeIndex}
        cancelDrag={cancelDrag}
        editWord={editWord}
        nowPlayingWordIndex={nowPlayingWordIndex}
        transcription={transcription}
        seekToWord={seekToWord}
        submitWordEdit={submitWordEdit}
        selectionSet={selectionSet}
        transcriptionIndex={transcriptionIndex}
      />
    );
  });

  return <>{takes}</>;
};

export default TakeGroupComponent;
