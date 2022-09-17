import styled from '@emotion/styled';
import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  editWordFinished,
  editWordUpdated,
} from 'renderer/store/editWord/actions';
import { TextField } from '@mui/material';
import {
  getCanvasFont,
  getColourForIndex,
  getTextWidth,
} from 'renderer/utils/ui';
import { WordMouseHandler } from './DragSelectManager';
import { handleSelectWord } from '../../editor/selection';
import colors from '../../colors';

const BORDER_RADIUS_AMOUNT = '6px'; // for highlight backgrounds

const makeWordInner = (isInInactiveTake: boolean) =>
  styled('div')({
    display: 'inline-block',
    cursor: isInInactiveTake ? 'pointer' : 'text',
    color: isInInactiveTake ? colors.grey[600] : colors.white,
    padding: '0 2px',
    margin: '2px 0',
    borderRadius: '7px',

    '&:hover': {
      color: colors.grey['000'],
      background: isInInactiveTake ? 'none' : `${colors.blue[500]}66`,
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
  onMouseEnter: (index: number) => void;
  submitWordEdit: () => void;
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
  text: string | null;
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
  onMouseEnter,
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

  const ref = useRef<HTMLDivElement>(null);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (isInInactiveTake) {
        return;
      }

      setPlaybackTime(outputStartTime + 0.01); // add a small amount so the correct word is selected
      handleSelectWord(index);

      // Prevent event from being received by the transcription block and therefore intercepted,
      // which would clear the selection
      event.stopPropagation();
    },
    [isInInactiveTake, setPlaybackTime, outputStartTime, index]
  );

  const highlightStyles: React.CSSProperties = useMemo(
    () =>
      (() => {
        if (isBeingEdited) {
          return {};
        }
        if (isSelected) {
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
      isPlaying,
      isSelectedLeftCap,
      isSelectedRightCap,
      isSelectedByAnotherClientLeftCap,
      isSelectedByAnotherClientRightCap,
      selectedByClientWithIndex,
      confidence,
    ]
  );

  const style = useMemo(
    () => ({
      ...defaultStyles,
      ...highlightStyles,
    }),
    [highlightStyles]
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
    () => makeWordInner(isInInactiveTake),
    [isInInactiveTake]
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

  const onMouseEnterWrapped = useCallback(
    () => onMouseEnter(index),
    [onMouseEnter, index]
  );

  const textOrUnderscore = text ?? '_';

  return (
    <WordInner
      ref={ref}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDownWrapped}
      onMouseEnter={onMouseEnterWrapped}
      style={style}
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
          value={editText ?? textOrUnderscore}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={submitIfEnter}
        />
      ) : (
        textOrUnderscore
      )}
    </WordInner>
  );
};

export default React.memo(WordComponent);
