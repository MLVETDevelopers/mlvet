import styled from '@emotion/styled';
import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useMemo,
  RefObject,
  useState,
  useCallback,
} from 'react';
import { MousePosition } from '@react-hook/mouse-position';
import { pointIsInsideRect } from 'renderer/utils/geometry';
import { useDispatch } from 'react-redux';
import {
  editWordFinished,
  editWordStarted,
  editWordUpdated,
} from 'renderer/store/editWord/actions';
import { TextField } from '@mui/material';
import {
  getCanvasFont,
  getColourForIndex,
  getTextWidth,
} from 'renderer/utils/ui';
import { DragState } from './WordDragManager';
import { handleSelectWord } from '../../editor/selection';
import colors from '../../colors';

const BORDER_RADIUS_AMOUNT = '6px'; // for highlight backgrounds

const makeWordInner = (isDragActive: boolean, isInInactiveTake: boolean) =>
  styled('div')({
    display: 'inline-block',
    cursor: isInInactiveTake ? 'pointer' : 'text',
    color: colors.white,
    padding: '0 2px',
    margin: '2px 0',
    borderRadius: '7px',

    '&:hover': {
      color: colors.grey['000'],
      background:
        isDragActive || isInInactiveTake ? 'none' : `${colors.blue[500]}66`,
      borderRadius: BORDER_RADIUS_AMOUNT,
    },
  });

// thresholds below which words are suggested to be corrected - highlight colour depends on which threshold is crossed
const CONFIDENCE_THRESHOLD_MEDIUM = 0.6;
const CONFIDENCE_THRESHOLD_LOW = 0.4;

interface Props {
  index: number;
  seekToWord: () => void;
  isPlaying: boolean;
  isSelected: boolean;
  confidence: number;
  isSelectedLeftCap: boolean; // whether the word is the first word in a contiguous selection
  isSelectedRightCap: boolean; // whether the word is the last word in a contiguous selection
  selectedByClientWithIndex: number | null;
  isSelectedByAnotherClientLeftCap: boolean;
  isSelectedByAnotherClientRightCap: boolean;
  text: string;
  onMouseDown: (
    wordRef: RefObject<HTMLDivElement>
  ) => MouseEventHandler<HTMLDivElement>;
  onMouseMove: () => void;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  isBeingDragged: boolean; // whether THIS word is currently being dragged
  mouse: MousePosition | null;
  isDropBeforeActive: boolean;
  isDropAfterActive: boolean;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  isBeingEdited: boolean;
  editText: string | null;
  isInInactiveTake: boolean;
  isShowingConfidenceUnderlines: boolean;
}

const WordComponent = ({
  index,
  seekToWord,
  isPlaying,
  isSelected,
  confidence,
  isSelectedLeftCap,
  isSelectedRightCap,
  text,
  onMouseDown,
  onMouseMove,
  dragState,
  isBeingDragged,
  mouse,
  isDropBeforeActive,
  isDropAfterActive,
  setDropBeforeIndex,
  cancelDrag,
  submitWordEdit,
  isBeingEdited,
  editText,
  isInInactiveTake,
  isShowingConfidenceUnderlines,
  selectedByClientWithIndex,
  isSelectedByAnotherClientLeftCap,
  isSelectedByAnotherClientRightCap,
}: Props) => {
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isBeingEdited && inputRef?.current !== null) {
      inputRef.current.select();
    }
  }, [isBeingEdited, inputRef]);

  // For handling receiving double-clicks on a word
  const [awaitingSecondClick, setAwaitingSecondClick] =
    useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const refRect = ref.current?.getBoundingClientRect();
  const xPosition = refRect?.left ?? 0;
  const yPosition = refRect?.top ?? 0;
  const halfWidth = (ref.current?.offsetWidth ?? 0) / 2;
  const height = ref.current?.offsetHeight ?? 0;
  const mouseX = mouse?.clientX ?? 0;
  const mouseY = mouse?.clientY ?? 0;

  useEffect(() => {
    if (
      isBeingDragged &&
      ((mouse?.clientX ?? null) === null || (mouse?.clientY ?? null) === null)
    ) {
      cancelDrag();
    }
  }, [isBeingDragged, mouse, cancelDrag]);

  const mouseInLeft = useMemo(
    () =>
      !isBeingDragged &&
      pointIsInsideRect(
        {
          x: mouseX,
          y: mouseY,
        },
        {
          x: xPosition,
          y: yPosition,
          w: halfWidth,
          h: height,
        }
      ),
    [xPosition, yPosition, halfWidth, height, mouseX, mouseY, isBeingDragged]
  );

  const mouseInRight = useMemo(
    () =>
      !isBeingDragged &&
      pointIsInsideRect(
        {
          x: mouseX,
          y: mouseY,
        },
        {
          x: xPosition + halfWidth,
          y: yPosition,
          w: halfWidth,
          h: height,
        }
      ),
    [xPosition, yPosition, halfWidth, height, mouseX, mouseY, isBeingDragged]
  );

  useEffect(() => {
    if (mouseInLeft && !isDropBeforeActive) {
      setDropBeforeIndex(index);
    } else if (mouseInRight && !isDropAfterActive) {
      setDropBeforeIndex(index + 1);
    }
  }, [
    mouseInLeft,
    mouseInRight,
    isDropBeforeActive,
    isDropAfterActive,
    setDropBeforeIndex,
    index,
  ]);

  const startEditing = () => {
    dispatch(editWordStarted(index, text));
  };

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (isInInactiveTake) {
      return;
    }

    if (awaitingSecondClick) {
      startEditing();
      return;
    }

    setAwaitingSecondClick(true);
    const DOUBLE_CLICK_THRESHOLD = 500; // ms
    setTimeout(() => {
      setAwaitingSecondClick(false);
    }, DOUBLE_CLICK_THRESHOLD);

    seekToWord();
    handleSelectWord(event, index);

    // Prevent event from being received by the transcription block and therefore intercepted,
    // which would clear the selection
    event.stopPropagation();
  };

  const defaultStyles: React.CSSProperties = {
    zIndex: 0,
  };

  const highlightStyles: React.CSSProperties = (() => {
    if (isBeingEdited) {
      return {};
    }
    if (isSelected || isBeingDragged) {
      return {
        background: `${colors.blue[500]}cc`,
        color: colors.white,
        borderTopLeftRadius: isSelectedLeftCap ? BORDER_RADIUS_AMOUNT : 0,
        borderBottomLeftRadius: isSelectedLeftCap ? BORDER_RADIUS_AMOUNT : 0,
        borderTopRightRadius: isSelectedRightCap ? BORDER_RADIUS_AMOUNT : 0,
        borderBottomRightRadius: isSelectedRightCap ? BORDER_RADIUS_AMOUNT : 0,
      };
    }
    if (isPlaying) {
      return {
        background: `${colors.yellow[500]}cc`,
        color: colors.white,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
        borderRadius: BORDER_RADIUS_AMOUNT,
      };
    }
    if (selectedByClientWithIndex !== null) {
      return {
        background: `${getColourForIndex(selectedByClientWithIndex)}cc`,
        color: colors.white,
        borderTopLeftRadius: isSelectedByAnotherClientLeftCap
          ? BORDER_RADIUS_AMOUNT
          : 0,
        borderBottomLeftRadius: isSelectedByAnotherClientLeftCap
          ? BORDER_RADIUS_AMOUNT
          : 0,
        borderTopRightRadius: isSelectedByAnotherClientRightCap
          ? BORDER_RADIUS_AMOUNT
          : 0,
        borderBottomRightRadius: isSelectedByAnotherClientRightCap
          ? BORDER_RADIUS_AMOUNT
          : 0,
      };
    }
    if (isShowingConfidenceUnderlines) {
      if (confidence < CONFIDENCE_THRESHOLD_LOW) {
        return {
          borderBottom: `2px solid rgba(255, 0, 0, 0.6)`,
          marginBottom: 0,
        };
      }
      if (confidence < CONFIDENCE_THRESHOLD_MEDIUM) {
        return {
          borderBottom: `2px solid ${colors.yellow[500]}88`,
          marginBottom: 0,
        };
      }
    }
    return {};
  })();

  const dragStyles: React.CSSProperties = isBeingDragged
    ? {
        position: 'fixed',
        left: mouseX + (dragState?.offset.x ?? 0),
        top: mouseY + (dragState?.offset.y ?? 0),
        zIndex: 100,
      }
    : {};

  const style = {
    ...defaultStyles,
    ...highlightStyles,
    ...dragStyles,
  };

  const submitIfEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Save and close edit
      submitWordEdit();
    } else if (event.key === 'Escape') {
      // Close edit without saving
      dispatch(editWordFinished());
    }
  };

  const WordInner = useMemo(
    () => makeWordInner(dragState !== null, isInInactiveTake),
    [dragState, isInInactiveTake]
  );

  const setEditText = (value: string) => {
    dispatch(editWordUpdated(value));
  };

  const onMouseUp: (event: React.MouseEvent) => void = (event) => {
    // Prevent edit from being cancelled if clicking the word
    if (isBeingEdited) {
      event.stopPropagation();
    }
  };

  const MIN_EDIT_WIDTH = 10;

  const onMouseDownWrapped = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isInInactiveTake) {
        return null;
      }

      return onMouseDown(ref)(event);
    },
    [isInInactiveTake, onMouseDown, ref]
  );

  return (
    <WordInner
      ref={ref}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDownWrapped}
      onMouseMove={onMouseMove}
      style={{ ...style, position: isBeingDragged ? 'fixed' : 'relative' }}
    >
      {isBeingEdited ? (
        <TextField
          variant="standard"
          inputRef={inputRef}
          inputProps={{
            sx: {
              height: '1em',
              width: Math.max(
                MIN_EDIT_WIDTH,
                getTextWidth(
                  editText ?? '',
                  getCanvasFont(inputRef?.current)
                ) ?? 0
              ),
            },
          }}
          type="text"
          value={editText ?? text}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={submitIfEnter}
        />
      ) : (
        text
      )}
    </WordInner>
  );
};

export default WordComponent;
