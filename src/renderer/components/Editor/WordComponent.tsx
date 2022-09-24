import styled from '@emotion/styled';
import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useMemo,
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
import store from 'renderer/store/store';
import { videoSeek } from 'renderer/store/playback/actions';
import { DragState, WordMouseHandler } from './WordDragManager';
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

const defaultStyles: React.CSSProperties = {
  zIndex: 0,
};

// thresholds below which words are suggested to be corrected - highlight colour depends on which threshold is crossed
const CONFIDENCE_THRESHOLD_MEDIUM = 0.6;
const CONFIDENCE_THRESHOLD_LOW = 0.4;

// pixels
const MIN_EDIT_WIDTH = 10;

export interface WordPassThroughProps {
  isInInactiveTake: boolean;
  isPlaying: boolean;
  onMouseDown: WordMouseHandler;
  onMouseMove: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  setDropBeforeIndex: (index: number) => void;
  setPlaybackTime: (time: number) => void;
}

interface Props extends WordPassThroughProps {
  index: number;
  isSelected: boolean;
  confidence: number;
  isSelectedLeftCap: boolean; // whether the word is the first word in a contiguous selection
  isSelectedRightCap: boolean; // whether the word is the last word in a contiguous selection
  selectedByClientWithIndex: number | null;
  isSelectedByAnotherClientLeftCap: boolean;
  isSelectedByAnotherClientRightCap: boolean;
  text: string;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  isBeingDragged: boolean; // whether THIS word is currently being dragged
  mouse: MousePosition | null;
  isDropBeforeActive: boolean;
  isDropAfterActive: boolean;
  isBeingEdited: boolean;
  editText: string | null;
  outputStartTime: number;
}

const WordComponent = ({
  index,
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
  selectedByClientWithIndex,
  isSelectedByAnotherClientLeftCap,
  isSelectedByAnotherClientRightCap,
  setPlaybackTime,
  outputStartTime,
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

  const { xPosition, yPosition, halfWidth, height, mouseX, mouseY } =
    useMemo(() => {
      const refRect = ref.current?.getBoundingClientRect();

      return {
        xPosition: refRect?.left ?? 0,
        yPosition: refRect?.top ?? 0,
        halfWidth: (ref.current?.offsetWidth ?? 0) / 2,
        height: ref.current?.offsetHeight ?? 0,
        mouseX: mouse?.clientX ?? 0,
        mouseY: mouse?.clientY ?? 0,
      };
    }, [ref, mouse]);

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

  const startEditing = useCallback(() => {
    dispatch(editWordStarted(index, text));
  }, [dispatch, index, text]);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
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

      setPlaybackTime(outputStartTime + 0.01); // add a small amount so the correct word is selected
      store.dispatch(
        videoSeek({
          time: outputStartTime + 0.01,
          lastUpdated: new Date(),
        })
      );
      handleSelectWord(event, index);

      // Prevent event from being received by the transcription block and therefore intercepted,
      // which would clear the selection
      event.stopPropagation();
    },
    [
      isInInactiveTake,
      awaitingSecondClick,
      startEditing,
      setAwaitingSecondClick,
      setPlaybackTime,
      outputStartTime,
      index,
    ]
  );

  const highlightStyles: React.CSSProperties = useMemo(
    () =>
      (() => {
        if (isBeingEdited) {
          return {};
        }
        if (isSelected || isBeingDragged) {
          return {
            background: `${colors.blue[500]}cc`,
            color: colors.white,
            borderTopLeftRadius: isSelectedLeftCap ? BORDER_RADIUS_AMOUNT : 0,
            borderBottomLeftRadius: isSelectedLeftCap
              ? BORDER_RADIUS_AMOUNT
              : 0,
            borderTopRightRadius: isSelectedRightCap ? BORDER_RADIUS_AMOUNT : 0,
            borderBottomRightRadius: isSelectedRightCap
              ? BORDER_RADIUS_AMOUNT
              : 0,
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
        return {};
      })(),
    [
      isBeingEdited,
      isSelected,
      isBeingDragged,
      isPlaying,
      isSelectedLeftCap,
      isSelectedRightCap,
      isSelectedByAnotherClientLeftCap,
      isSelectedByAnotherClientRightCap,
      selectedByClientWithIndex,
      confidence,
    ]
  );

  const dragStyles: React.CSSProperties = useMemo(
    () =>
      isBeingDragged
        ? {
            position: 'fixed',
            left: mouseX + (dragState?.offset.x ?? 0),
            top: mouseY + (dragState?.offset.y ?? 0),
            zIndex: 100,
          }
        : {},
    [isBeingDragged, mouseX, mouseY, dragState]
  );

  const style = useMemo(
    () => ({
      ...defaultStyles,
      ...highlightStyles,
      ...dragStyles,
    }),
    [highlightStyles, dragStyles]
  );

  const submitIfEnter = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Save and close edit
        submitWordEdit();
      } else if (event.key === 'Escape') {
        // Close edit without saving
        dispatch(editWordFinished());
      }
    },
    [submitWordEdit, dispatch]
  );

  const WordInner = useMemo(
    () => makeWordInner(dragState !== null, isInInactiveTake),
    [dragState, isInInactiveTake]
  );

  const setEditText = useCallback(
    (value: string) => {
      dispatch(editWordUpdated(value));
    },
    [dispatch]
  );

  const onMouseUp = useCallback(
    (event) => {
      // Prevent edit from being cancelled if clicking the word
      if (isBeingEdited) {
        event.stopPropagation();
      }
    },
    [isBeingEdited]
  );

  const onMouseDownWrapped = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isInInactiveTake) {
        return null;
      }

      return onMouseDown(index)(ref)(event);
    },
    [isInInactiveTake, index, onMouseDown, ref]
  );

  const onMouseMoveWrapped = useCallback(
    () => onMouseMove(index),
    [onMouseMove, index]
  );

  return (
    <WordInner
      ref={ref}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDownWrapped}
      onMouseMove={onMouseMoveWrapped}
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

export default React.memo(WordComponent);
