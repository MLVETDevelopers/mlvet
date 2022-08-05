import { MouseEventHandler, useRef, useState } from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseUp: WordMouseHandler,
  isWordBeingDragged: CurriedByWordIndex<boolean>,
  mouseX: MousePosition['clientX'],
  mouseY: MousePosition['clientY'],
) => (JSX.Element | null)[];

interface Props {
  renderTranscription: RenderTranscription;
}

const DragCapture = ({ renderTranscription }: Props) => {
  const [currentDraggedWordIndex, setCurrentDraggedWordIndex] = useState<
    number | null
  >(null);

  const ref = useRef(null);

  const mouse = useMouse(ref);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    console.log('down', event);
  };

  const onMouseUp: MouseEventHandler<HTMLDivElement> = (event) => {
    console.log('up', event);
    setCurrentDraggedWordIndex(null);
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

  console.log(currentDraggedWordIndex);

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
        isWordBeingDragged,
        mouse.clientX,
        mouse.clientY,
      )}
    </div>
  );
};

export default DragCapture;
