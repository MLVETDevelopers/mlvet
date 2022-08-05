import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/sharedHelpers';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeMoveWords } from 'renderer/store/undoStack/ops';

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
) => (JSX.Element | null)[];

interface Props {
  renderTranscription: RenderTranscription;
}

const DragCapture = ({ renderTranscription }: Props) => {
  const words = useSelector(
    (store: ApplicationStore) => store.currentProject?.transcription?.words
  );

  const [currentDraggedWordIndex, setCurrentDraggedWordIndex] = useState<
    number | null
  >(null);

  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);

  const ref = useRef(null);

  const mouse = useMouse(ref);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    console.log('down', event);
  };

  const onMouseUp: MouseEventHandler<HTMLDivElement> = (event) => {
    setCurrentDraggedWordIndex(null);

    if (
      dropBeforeIndex !== null &&
      currentDraggedWordIndex !== null &&
      words !== undefined
    ) {
      dispatchOp(
        makeMoveWords(
          [{
            startIndex: currentDraggedWordIndex,
            endIndex: currentDraggedWordIndex + 1,
          }],
          dropBeforeIndex - 1
        )
      );
    }
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    // console.log('move', event);
  };

  const onWordMouseDown: WordMouseHandler = (wordIndex) => (event) => {
    console.log('word down', wordIndex, event);
    setCurrentDraggedWordIndex(wordIndex);
  };

  const onWordMouseUp: WordMouseHandler = (wordIndex) => (event) => {
    console.log('word up', wordIndex, event);
  };

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

export default DragCapture;
