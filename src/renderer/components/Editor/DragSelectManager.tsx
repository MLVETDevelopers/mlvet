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
import { useDispatch, useSelector } from 'react-redux';
import { IndexRange } from 'sharedTypes';
import { ContainerRefContext } from 'renderer/RootContainerContext';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { areRangesEqual } from 'renderer/utils/range';
import { selectionRangeSetTo } from '../../store/selection/actions';
import { MouseButton } from '../../utils/input';

export type CurriedByWordIndex<T> = (wordIndex: number) => T;

export type WordMouseHandler = CurriedByWordIndex<
  (wordRef: RefObject<HTMLDivElement>) => MouseEventHandler<HTMLDivElement>
>;

export type RenderTranscription = (
  onWordMouseDown: WordMouseHandler,
  onWordMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void,
  partialSelectState: PartialSelectState | null,
  setPartialSelectState: React.Dispatch<
    React.SetStateAction<PartialSelectState | null>
  >,
  isMouseDown: boolean
) => JSX.Element;

interface Props {
  clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void;
  children: RenderTranscription;
}

export interface PartialSelectState {
  wordIndex: number;
  anchorLetterIndex: number;
  currentLetterIndex: number;
}

const DragSelectManager = ({ clearSelection, children }: Props) => {
  const [partialSelectState, setPartialSelectState] =
    useState<PartialSelectState | null>(null);

  const [isMouseDown, setMouseDown] = useState<boolean>(false);

  const containerRef = useContext(ContainerRefContext);

  const selection = useSelector(
    (state: ApplicationStore) => state.selection.self
  );

  const dispatch = useDispatch();

  // Index of the word that the drag-select action started from
  const [dragSelectAnchor, setDragSelectAnchor] = useState<number | null>(null);

  // Handle mouse-up events on the overall page using the container ref
  useEffect(() => {
    if (containerRef !== null && containerRef.current !== null) {
      containerRef.current.onmouseup = () => {
        clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null));
        setMouseDown(false);
      };
    }
  }, [containerRef, clearSelection, dragSelectAnchor, setDragSelectAnchor]);

  // Handles mouse-down events on a particular word
  const onWordMouseDown: WordMouseHandler = useCallback(
    (wordIndex) => () => (event) => {
      // Only start dragging if the mouse button pressed was the left one
      if (event.button !== MouseButton.LEFT) {
        return;
      }

      setMouseDown(true);

      // Start a drag-select action
      setDragSelectAnchor(wordIndex);
    },
    [setDragSelectAnchor]
  );

  const onWordMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void = useCallback(
    (wordIndex) => () => {
      if (dragSelectAnchor === null) {
        return;
      }

      const range: IndexRange = {
        startIndex: Math.min(wordIndex, dragSelectAnchor),
        endIndex: Math.max(wordIndex, dragSelectAnchor) + 1,
      };

      if (areRangesEqual(range, selection)) {
        return;
      }

      dispatch(selectionRangeSetTo(range));
    },
    [dragSelectAnchor, dispatch, selection]
  );

  const childrenRendered = useMemo(
    () =>
      children(
        onWordMouseDown,
        onWordMouseEnter,
        partialSelectState,
        setPartialSelectState,
        isMouseDown
      ),
    [
      onWordMouseDown,
      onWordMouseEnter,
      partialSelectState,
      setPartialSelectState,
      isMouseDown,
      children,
    ]
  );

  return (
    <div id="word-drag-manager" style={{ height: '100%' }}>
      {childrenRendered}
    </div>
  );
};

export default React.memo(DragSelectManager);
