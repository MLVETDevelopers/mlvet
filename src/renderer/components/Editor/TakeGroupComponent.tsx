import { MousePosition } from '@react-hook/mouse-position';
import { Dispatch, SetStateAction, useState } from 'react';
import { mapWithAccumulator } from 'renderer/utils/list';
import { getNumWordsInTake } from 'renderer/utils/takeDetection';
import { Take, TakeGroup } from 'sharedTypes';
import TakeComponent from './TakeComponent';
import { WordMouseHandler, DragState } from './WordDragManager';

interface TakeGroupComponentProps {
  takeGroup: TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mousePosition: MousePosition;
  mouseThrottled: MousePosition;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>;
  cancelDrag: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
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
}: TakeGroupComponentProps) => {
  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(false);

  const openTakeGroup = () => {
    setIsTakeGroupOpened(true);
    console.log('Opened Take Group');
  };

  return (
    <>
      {Array.isArray(takeGroup?.takes) &&
        mapWithAccumulator(
          takeGroup.takes,
          (take: Take, index: number, acc) => {
            return {
              item: (
                <TakeComponent
                  take={take}
                  takeIndex={index}
                  isActive={index === takeGroup.activeTakeIndex}
                  isTakeGroupOpened={isTakeGroupOpened}
                  openTakeGroup={openTakeGroup}
                  transcriptionIndex={acc}
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
                />
              ),
              acc: acc + getNumWordsInTake(take),
            };
          },
          chunkIndex
        )}
    </>
  );
};

export default TakeGroupComponent;
