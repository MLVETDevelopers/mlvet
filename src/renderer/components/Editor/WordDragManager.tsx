/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useMouse, { MousePosition } from '@react-hook/mouse-position';
import { useDispatch, useSelector } from 'react-redux';
import { Point } from 'electron';
import { useThrottle } from '@react-hook/throttle';
import { IndexRange } from 'sharedTypes';
import { useDebounceCallback } from '@react-hook/debounce';
import dispatchOp from 'renderer/store/dispatchOp';
import { ContainerRefContext } from 'renderer/RootContainerContext';
import { makeMoveWords } from '../../store/transcriptionWords/ops/moveWords';
import {
  selectionCleared,
  selectionRangesSetTo,
} from '../../store/selection/actions';
import { rangeLengthOne } from '../../utils/range';
import { MouseButton } from '../../utils/input';
import { ApplicationStore } from '../../store/sharedHelpers';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  (wordRef: RefObject<HTMLDivElement>) => MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseMove: (wordIndex: number) => void,
  dragState: DragState,
  isWordBeingDragged: CurriedByWordIndex<boolean>,
  mouse: MousePosition | null,
  mouseThrottled: MousePosition | null,
  dropBeforeIndex: number | null,
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>,
  cancelDrag: () => void
) => JSX.Element;

export type DragState = null | {
  offset: Point;
  wordIndex: number;
};

interface Props {
  clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void;
  children: RenderTranscription;
}

const WordDragManager = ({ clearSelection, children }: Props) => {
  const containerRef = useContext(ContainerRefContext);

  const dispatch = useDispatch();

  const words = useSelector(
    (store: ApplicationStore) => store.currentProject?.transcription?.words
  );

  // Information relating to the word currently being dragged (index and offset when the word was clicked).
  // Null if no word is currently being dragged
  const [dragState, setDragState] = useState<DragState>(null);

  // Index of the word that the drag-select action started from
  const [dragSelectAnchor, setDragSelectAnchor] = useState<number | null>(null);

  // Index of the word that is currently marked as the 'drop' receiver for the word being dragged
  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);

  // Handle mouse-up events on the overall page using the container ref
  useEffect(() => {
    if (containerRef !== null && containerRef.current !== null) {
      containerRef.current.onmouseup = () =>
        clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null));
    }
  }, [containerRef, clearSelection, dragSelectAnchor, setDragSelectAnchor]);

  const mouse = useMouse(containerRef);

  // Default throttle is 30 fps, seems reasonable for now
  const [mouseThrottled, setMouseThrottled] = useThrottle(mouse);

  useEffect(() => {
    setMouseThrottled(mouse);
  }, [mouse, setMouseThrottled]);

  // Handles words being dragged around
  const startDragMoveWord: WordMouseHandler = useCallback(
    (wordIndex) => (wordRef) => (event) => {
      // Clear the current selection so that other words don't stay selected when a word is being dragged
      dispatch(selectionCleared());

      // Calculate the offset between the mouse position and the word so that this can be maintained throughout the drag action;
      // this makes for a more natural experience than forcing the word to always have e.g. its top left corner at the mouse position
      const wordPosition = wordRef.current?.getBoundingClientRect();
      const offset: Point = {
        x: (wordPosition?.left ?? 0) - event.clientX,
        y: (wordPosition?.top ?? 0) - event.clientY,
      };

      // Update the drag state to mark the start of the drag action
      setDragState({ offset, wordIndex });
    },
    [dispatch, setDragState]
  );

  // Handles mouse-down events on a particular word
  const onWordMouseDown: WordMouseHandler = useCallback(
    (wordIndex) => (wordRef) => (event) => {
      // Only start dragging if the mouse button pressed was the left one
      if (event.button !== MouseButton.LEFT) {
        return;
      }

      if (event.altKey) {
        // If alt/option held, then start a drag-move action
        startDragMoveWord(wordIndex)(wordRef)(event);
        setDragSelectAnchor(wordIndex);
      } else {
        // Otherwise, start a drag-select action
        setDragSelectAnchor(wordIndex);
      }
    },
    [startDragMoveWord, setDragSelectAnchor]
  );

  const onWordMouseMove: (wordIndex: number) => void = useCallback(
    (wordIndex) => {
      if (dragSelectAnchor === null) {
        return;
      }

      const range: IndexRange = {
        startIndex: Math.min(wordIndex, dragSelectAnchor),
        endIndex: Math.max(wordIndex, dragSelectAnchor) + 1,
      };

      dispatch(selectionRangesSetTo([range]));
    },
    [dragSelectAnchor, dispatch]
  );

  const onWordMouseMoveDebounced = useDebounceCallback(onWordMouseMove, 10);

  // Helper to determine whether a given word is being dragged
  const isWordBeingDragged: (wordIndex: number) => boolean = useCallback(
    (wordIndex) => {
      return dragState?.wordIndex === wordIndex;
    },
    [dragState]
  );

  // Handles mouse-up events anywhere in the transcription box
  const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(() => {
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

      // TODO(chloe): seek to the word that was moved
    }
  }, [dropBeforeIndex, dragState, words, setDragState]);

  const cancelDrag = useCallback(() => {
    setDragState(null);
  }, [setDragState]);

  return (
    <div
      id="word-drag-manager"
      style={{ height: '100%' }}
      onMouseUp={onMouseUp}
    >
      {children(
        onWordMouseDown,
        onWordMouseMoveDebounced,
        dragState,
        isWordBeingDragged,
        dragState === null ? null : mouse,
        dragState === null ? null : mouseThrottled,
        dropBeforeIndex,
        setDropBeforeIndex,
        cancelDrag
      )}
    </div>
  );
};

export default WordDragManager;
