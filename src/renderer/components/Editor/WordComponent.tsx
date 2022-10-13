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
  letterIndexAtXPosition,
} from 'renderer/utils/ui';

import { PartialSelectState, WordMouseHandler } from './DragSelectManager';
import { handleSelectWord } from '../../editor/selection';
import colors from '../../colors';
import WordPartialHighlight from './WordPartialHighlight';
import PauseMarker from './PauseMarker';

const BORDER_RADIUS_AMOUNT = '6px'; // for highlight backgrounds

const makeWordInner = (
  isInInactiveTake: boolean,
  partialSelectState: PartialSelectState | null
) =>
  styled('div')({
    display: 'inline-block',
    cursor: isInInactiveTake ? 'pointer' : 'text',
    color: isInInactiveTake ? colors.grey[600] : colors.white,
    padding: '0 2px',
    margin: 0,
    borderRadius: '7px',

    '&:hover': {
      color: colors.grey['000'],
      background:
        isInInactiveTake || partialSelectState !== null
          ? 'none'
          : `${colors.blue[500]}66`,
      borderRadius: BORDER_RADIUS_AMOUNT,
    },
  });

const defaultStyles: React.CSSProperties = {
  zIndex: 0,
  position: 'relative',
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
  onMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void;
  submitWordEdit: () => void;
  setPlaybackTime: (time: number) => void;
  setPartialSelectState: React.Dispatch<
    React.SetStateAction<PartialSelectState | null>
  >;
  isMouseDown: boolean;
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
  isPrevWordSelected: boolean;
  isNextWordSelected: boolean;
  partialSelectState: PartialSelectState | null;
  bufferedDuration: number;
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
  isPrevWordSelected,
  isNextWordSelected,
  partialSelectState,
  setPartialSelectState,
  isMouseDown,
  bufferedDuration,
}: Props) => {
  useEffect(() => {
    setPartialSelectState((prevState) => {
      if (isPrevWordSelected && isNextWordSelected) {
        return null;
      }

      return prevState;
    });
  }, [setPartialSelectState, isPrevWordSelected, isNextWordSelected]);

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
        if (isBeingEdited || partialSelectState !== null) {
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
      partialSelectState,
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
    () => makeWordInner(isInInactiveTake, partialSelectState),
    [isInInactiveTake, partialSelectState]
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

      // Fill out selection to entire word
      // TODO(chloe): put this in the drag manager
      setPartialSelectState(null);
    },
    [isBeingEdited, setPartialSelectState]
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

  const updatePartialSelect = useCallback(
    (event: React.MouseEvent) => {
      if (!isMouseDown) {
        return;
      }

      if ((isPrevWordSelected && isNextWordSelected) || !isSelected) {
        return;
      }

      const wordXPosition = ref.current?.getBoundingClientRect().left ?? 0;
      const mouseXPosition = event.clientX;
      const xOffset = mouseXPosition - wordXPosition;

      const letterIndex = letterIndexAtXPosition(
        text ?? '',
        xOffset,
        getCanvasFont(ref?.current) ?? ''
      );

      if (letterIndex === null) {
        return;
      }

      setPartialSelectState((prevState) => {
        let anchor = letterIndex;
        if (prevState?.wordIndex === index) {
          anchor = prevState.anchorLetterIndex;
        } else if (isPrevWordSelected) {
          anchor = 0;
        } else if (isNextWordSelected) {
          anchor = text?.length ?? 0;
        }

        return {
          wordIndex: index,
          anchorLetterIndex: anchor,
          currentLetterIndex: letterIndex,
        };
      });
    },
    [
      ref,
      isPrevWordSelected,
      isNextWordSelected,
      setPartialSelectState,
      isSelected,
      index,
      text,
      isMouseDown,
    ]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      updatePartialSelect(event);
      onMouseEnter(index, isSelected)(event);
    },
    [updatePartialSelect, onMouseEnter, index, isSelected]
  );

  const textOrPauseMarker = text ?? (
    <PauseMarker
      duration={bufferedDuration}
      isHighlighted={isPlaying || isSelected}
    />
  );

  const textWithPartialSelectionBackground =
    !(partialSelectState?.wordIndex === index) || !isSelected ? (
      textOrPauseMarker
    ) : (
      <>
        {textOrPauseMarker}
        <WordPartialHighlight
          wordRef={ref}
          text={text ?? ''}
          partialSelectState={partialSelectState}
        />
      </>
    );

  const wordId = `word-${index}`;

  return (
    <WordInner
      id={wordId}
      ref={ref}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDownWrapped}
      onMouseEnter={onMouseMove}
      onMouseMove={onMouseMove}
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
                  editText ?? text ?? '',
                  getCanvasFont(inputRef?.current)
                ) ?? 0
              ),
            },
          }}
          type="text"
          value={editText ?? text ?? ''}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={submitIfEnter}
        />
      ) : (
        textWithPartialSelectionBackground
      )}
    </WordInner>
  );
};

export default React.memo(WordComponent);
