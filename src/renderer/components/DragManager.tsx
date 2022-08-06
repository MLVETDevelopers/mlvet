/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeMoveWords } from 'renderer/store/undoStack/ops';
import { Point } from 'electron';
import {
  selectionCleared,
  selectionRangeAdded,
} from 'renderer/store/selection/actions';
import { ApplicationStore } from '../store/sharedHelpers';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  (wordRef: RefObject<HTMLDivElement>) => MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseUp: WordMouseHandler,
  dragState: DragState,
  isDragActive: boolean,
  isWordBeingDragged: CurriedByWordIndex<boolean>,
  mouse: MousePosition,
  dropBeforeIndex: number | null,
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>
) => JSX.Element;

export type DragState = null | {
  offset: Point;
  wordIndex: number;
};

interface Props {
  renderTranscription: RenderTranscription;
  seekToWord: (wordIndex: number) => void;
}

const DragManager = ({ seekToWord, renderTranscription }: Props) => {
  const dispatch = useDispatch();

  const words = useSelector(
    (store: ApplicationStore) => store.currentProject?.transcription?.words
  );

  const [dragState, setDragState] = useState<DragState>(null);

  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const mouse = useMouse(ref);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = () => {};

  const onMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    setDragState(null);

    if (
      dropBeforeIndex !== null &&
      dragState !== null &&
      dragState.wordIndex !== null &&
      words !== undefined
    ) {
      dispatchOp(
        makeMoveWords(
          [
            {
              startIndex: dragState.wordIndex,
              endIndex: dragState.wordIndex + 1,
            },
          ],
          dropBeforeIndex - 1
        )
      );
      dispatch(selectionCleared());
      seekToWord(dropBeforeIndex);
      dispatch(
        selectionRangeAdded({
          startIndex: dropBeforeIndex,
          endIndex: dropBeforeIndex + 1,
        })
      );
    }
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = () => {};

  const onWordMouseDown: WordMouseHandler =
    (wordIndex) => (wordRef) => (event) => {
      const offset: Point = {
        x: (wordRef.current?.offsetLeft ?? 0) - event.clientX,
        y: (wordRef.current?.offsetTop ?? 0) - event.clientY,
      };

      setDragState({ offset, wordIndex });
    };

  const onWordMouseUp: WordMouseHandler = () => () => () => {};

  const isWordBeingDragged: (wordIndex: number) => boolean = (wordIndex) => {
    return dragState?.wordIndex === wordIndex;
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
        dragState,
        dragState !== null,
        isWordBeingDragged,
        mouse,
        dropBeforeIndex,
        setDropBeforeIndex
      )}
    </div>
  );
};

export default DragManager;
