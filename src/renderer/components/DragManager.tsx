/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';
import { useSelector } from 'react-redux';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeMoveWords } from 'renderer/store/undoStack/ops';
import { ApplicationStore } from '../store/sharedHelpers';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseUp: WordMouseHandler,
  isDragActive: boolean,
  isWordBeingDragged: CurriedByWordIndex<boolean>,
  mouse: MousePosition,
  dropBeforeIndex: number | null,
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>
) => JSX.Element;

interface Props {
  renderTranscription: RenderTranscription;
}

const DragManager = ({ renderTranscription }: Props) => {
  const words = useSelector(
    (store: ApplicationStore) => store.currentProject?.transcription?.words
  );

  const [currentDraggedWordIndex, setCurrentDraggedWordIndex] = useState<
    number | null
  >(null);

  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const mouse = useMouse(ref);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = () => {};

  const onMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    setCurrentDraggedWordIndex(null);

    if (
      dropBeforeIndex !== null &&
      currentDraggedWordIndex !== null &&
      words !== undefined
    ) {
      dispatchOp(
        makeMoveWords(
          [
            {
              startIndex: currentDraggedWordIndex,
              endIndex: currentDraggedWordIndex + 1,
            },
          ],
          dropBeforeIndex - 1
        )
      );
    }
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = () => {};

  const onWordMouseDown: WordMouseHandler = (wordIndex) => () => {
    setCurrentDraggedWordIndex(wordIndex);
  };

  const onWordMouseUp: WordMouseHandler = () => () => {};

  const isWordBeingDragged: (wordIndex: number) => boolean = (wordIndex) => {
    return currentDraggedWordIndex === wordIndex;
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {renderTranscription(
        onWordMouseDown,
        onWordMouseUp,
        currentDraggedWordIndex !== null,
        isWordBeingDragged,
        mouse,
        dropBeforeIndex,
        setDropBeforeIndex
      )}
    </div>
  );
};

export default DragManager;
