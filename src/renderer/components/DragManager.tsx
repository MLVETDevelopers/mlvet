/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';
import { useDispatch, useSelector } from 'react-redux';
import { Point } from 'electron';
import { useThrottle } from '@react-hook/throttle';
import { dispatchOp } from '../store/undoStack/opHelpers';
import { makeMoveWords } from '../store/undoStack/ops';
import {
  selectionCleared,
  selectionRangeAdded,
} from '../store/selection/actions';
import { ApplicationStore } from '../store/sharedHelpers';
import { MouseButton, rangeLengthOne } from '../util';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  (wordRef: RefObject<HTMLDivElement>) => MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  dragState: DragState,
  isWordBeingDragged: CurriedByWordIndex<boolean>,
  mouse: MousePosition,
  mouseThrottled: MousePosition,
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

  // Information relating to the word currently being dragged (index and offset when the word was clicked).
  // Null if no word is currently being dragged
  const [dragState, setDragState] = useState<DragState>(null);

  // Index of the word that is currently marked as the 'drop' receiver for the word being dragged
  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);

  // Refs to the DragManager container div and the mouse position
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouse(ref);

  const [mouseThrottled, setMouseThrottled] = useThrottle(mouse);

  useEffect(() => {
    setMouseThrottled(mouse);
  }, [mouse, setMouseThrottled]);

  // Handles mouse-up events on a particular word
  const onWordMouseDown: WordMouseHandler = useMemo(
    () => (wordIndex) => (wordRef) => (event) => {
      // Only start dragging if alt/option is held and the mouse button pressed was the left one
      if (!(event.altKey && event.button === MouseButton.LEFT)) {
        return;
      }

      // Clear the current selection so that other words don't stay selected when a word is being dragged
      dispatch(selectionCleared());

      // Calculate the offset between the mouse position and the word so that this can be maintained throughout the drag action;
      // this makes for a more natural experience than forcing the word to always have e.g. its top left corner at the mouse position
      const offset: Point = {
        x: (wordRef.current?.offsetLeft ?? 0) - event.clientX,
        y: (wordRef.current?.offsetTop ?? 0) - event.clientY,
      };

      // Update the drag state to mark the start of the drag action
      setDragState({ offset, wordIndex });
    },
    [dispatch, setDragState]
  );

  // Helper to determine whether a given word is being dragged
  const isWordBeingDragged: (wordIndex: number) => boolean = useMemo(
    () => (wordIndex) => {
      return dragState?.wordIndex === wordIndex;
    },
    [dragState]
  );

  // Handles mouse-up events anywhere in the transcription box
  const onMouseUp: MouseEventHandler<HTMLDivElement> = useMemo(
    () => () => {
      if (
        dropBeforeIndex !== null &&
        dragState !== null &&
        dragState.wordIndex !== null &&
        words !== undefined
      ) {
        setDragState(null);

        dispatchOp(
          makeMoveWords(
            words,
            [rangeLengthOne(dragState.wordIndex)],
            dropBeforeIndex - 1
          )
        );

        // Reset the selection so that we can select just the word that was moved
        dispatch(selectionCleared());

        // The word that was moved now has an index of dropBeforeIndex,
        // as the word that had this index before has now moved one word to the right.
        dispatch(selectionRangeAdded(rangeLengthOne(dropBeforeIndex)));

        // TODO(chloe): seek to the word that was moved
      }
    },
    [dropBeforeIndex, dragState, words, setDragState, dispatch]
  );

  return (
    <div ref={ref} onMouseUp={onMouseUp}>
      {renderTranscription(
        onWordMouseDown,
        dragState,
        isWordBeingDragged,
        mouse,
        mouseThrottled,
        dropBeforeIndex,
        setDropBeforeIndex
      )}
    </div>
  );
};

export default DragManager;
