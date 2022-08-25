import styled from '@emotion/styled';
import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useMemo,
  RefObject,
  useState,
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
import { getCanvasFont, getTextWidth, INPUT_FONT } from 'renderer/utils/ui';
import { DragState } from './WordDragManager';
import { handleSelectWord } from '../../editor/selection';
import colors from '../../colors';

const makeWordInner = (isDragActive: boolean) =>
  styled('div')({
    display: 'inline-block',
    cursor: 'pointer',
    color: colors.white,
    transition: 'padding 0.1s, background 0.1s',
    padding: '0 2px',
    margin: '2px 0',

    '&:hover': {
      color: colors.grey['000'],
      background: isDragActive ? 'none' : `${colors.yellow[500]}50`,
    },
  });

interface Props {
  index: number;
  seekToWord: () => void;
  isPlaying: boolean;
  isSelected: boolean;
  text: string;
  onMouseDown: (
    wordRef: RefObject<HTMLDivElement>
  ) => MouseEventHandler<HTMLDivElement>;
  onMouseMove: () => void;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  isBeingDragged: boolean; // whether THIS word is currently being dragged
  mouse: MousePosition;
  isDropBeforeActive: boolean;
  isDropAfterActive: boolean;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  isBeingEdited: boolean;
  editText: string | null;
}

const WordComponent = ({
  index,
  seekToWord,
  isPlaying,
  isSelected,
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

  const xPosition = ref.current?.offsetLeft ?? 0;
  const yPosition = ref.current?.offsetTop ?? 0;
  const halfWidth = (ref.current?.offsetWidth ?? 0) / 2;
  const height = ref.current?.offsetHeight ?? 0;
  const mouseX = mouse.clientX ?? 0;
  const mouseY = mouse.clientY ?? 0;

  useEffect(() => {
    if (isBeingDragged && (mouse.clientX === null || mouse.clientY === null)) {
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
        background: `${colors.yellow[500]}cc`,
        color: colors.white,
        fontWeight: 'bold',
      };
    }
    if (isPlaying) {
      return {
        background: colors.blue[500],
        color: colors.white,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
      };
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
    () => makeWordInner(dragState !== null),
    [dragState]
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

  return (
    <WordInner
      ref={ref}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown(ref)}
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
              width: getTextWidth(
                editText ?? '',
                getCanvasFont(inputRef?.current) || INPUT_FONT
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
