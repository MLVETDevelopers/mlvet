/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, {
  MouseEventHandler,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { IndexRange } from 'sharedTypes';
import { useDebounceCallback } from '@react-hook/debounce';
import { ContainerRefContext } from 'renderer/RootContainerContext';
import { selectionRangesSetTo } from '../../store/selection/actions';
import { MouseButton } from '../../utils/input';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  (wordRef: RefObject<HTMLDivElement>) => MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseMove: (wordIndex: number) => void
) => JSX.Element;

interface Props {
  clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void;
  children: RenderTranscription;
}

const DragSelectManager = ({ clearSelection, children }: Props) => {
  const containerRef = useContext(ContainerRefContext);

  const dispatch = useDispatch();

  // Index of the word that the drag-select action started from
  const [dragSelectAnchor, setDragSelectAnchor] = useState<number | null>(null);

  // Handle mouse-up events on the overall page using the container ref
  useEffect(() => {
    if (containerRef !== null && containerRef.current !== null) {
      containerRef.current.onmouseup = () =>
        clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null));
    }
  }, [containerRef, clearSelection, dragSelectAnchor, setDragSelectAnchor]);

  // Handles mouse-down events on a particular word
  const onWordMouseDown: WordMouseHandler = useCallback(
    (wordIndex) => () => (event) => {
      // Only start dragging if the mouse button pressed was the left one
      if (event.button !== MouseButton.LEFT) {
        return;
      }

      // Start a drag-select action
      setDragSelectAnchor(wordIndex);
    },
    [setDragSelectAnchor]
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

  const childrenRendered = useMemo(
    () => children(onWordMouseDown, onWordMouseMoveDebounced),
    [onWordMouseDown, onWordMouseMoveDebounced, children]
  );

  return (
    <div id="word-drag-manager" style={{ height: '100%' }}>
      {childrenRendered}
    </div>
  );
};

export default React.memo(DragSelectManager);
