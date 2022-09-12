import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { useDispatch } from 'react-redux';
import { selectTake } from 'renderer/store/takeGroups/actions';
import { TakeInfo, Transcription, Word } from 'sharedTypes';
import React, { RefObject, useCallback, useMemo } from 'react';
import { ClientId } from 'collabTypes/collabShadowTypes';
import { EditWordState } from 'renderer/store/sharedHelpers';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

const makeTakeWrapper = (isTakeGroupOpened: boolean, isActive: boolean) =>
  styled(Box)({
    border: 'true',
    borderStyle: 'solid',
    borderWidth: '0px',
    borderLeftWidth: '2px',
    borderTopWidth: '2px',
    paddingLeft: '10px',
    borderColor: isTakeGroupOpened && isActive ? '#FFB355' : '#ABA9A9',
    opacity: isActive ? 1 : 0.5,
    position: 'relative',
    left: '20px',

    '&:hover': {
      borderColor: '#FFB355',
      cursor: 'pointer',
      opacity: isActive ? 1 : 0.8,
    },

    '&:last-child': {
      borderBottomWidth: '2px',
    },
  });

interface TakePassThroughProps {
  transcription: Transcription;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  setPlaybackTime: (time: number) => void;
  otherSelectionSets: Record<ClientId, Set<number>>;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouseThrottled: MousePosition | null;
  editWord: EditWordState;
}

interface TakeComponentProps extends TakePassThroughProps {
  takeWords: Word[];
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  setIsTakeGroupOpened: (isOpen: boolean) => void;
  mousePosition: MousePosition | null;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<number>;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: (wordIndex: number) => void;
  transcriptionIndex: number;
}

const TakeComponent = ({
  takeWords,
  takeIndex,
  isActive,
  isTakeGroupOpened,
  setIsTakeGroupOpened,
  mousePosition,
  nowPlayingWordIndex,
  selectionSet,
  onWordMouseDown,
  onWordMouseMove,
  transcriptionIndex,
  ...passThroughProps
}: TakeComponentProps) => {
  const dispatch = useDispatch();

  const onSelectTake = useCallback(() => {
    dispatch(selectTake(takeWords[0].takeInfo as TakeInfo));
    setIsTakeGroupOpened(false);
  }, [dispatch, takeWords, setIsTakeGroupOpened]);

  const TakeWrapper = useMemo(
    () => makeTakeWrapper(isTakeGroupOpened, isActive),
    [isTakeGroupOpened, isActive]
  );

  const onClick = useCallback(() => {
    if (isActive && !isTakeGroupOpened) {
      setIsTakeGroupOpened(true);
    } else {
      onSelectTake();
    }
  }, [isActive, isTakeGroupOpened, setIsTakeGroupOpened, onSelectTake]);

  return (
    <>
      <TakeWrapper className="take" onClick={onClick}>
        {isTakeGroupOpened && (
          <Avatar
            onClick={onSelectTake}
            sx={{
              height: 22,
              width: 22,
              fontSize: 12,
              color: '#1D201F',
              backgroundColor: isActive ? '#FFB355' : '#ABA9A9',
              display: 'flex',
              position: 'absolute',
              left: '-30px',
              transform: 'translateY(2px)',
              cursor: 'pointer',
            }}
          >
            {takeIndex + 1}
          </Avatar>
        )}

        {!isTakeGroupOpened && isActive && (
          <Avatar
            onClick={onSelectTake}
            sx={{
              height: 22,
              width: 22,
              fontSize: 12,
              color: '#fff',
              background: 'none',
              display: 'flex',
              position: 'absolute',
              left: '-30px',
              cursor: 'pointer',
              transform: 'translateY(2px)',
              opacity: 0.5,
            }}
          >
            {takeIndex + 1}
          </Avatar>
        )}
        {isTakeGroupOpened || isActive ? (
          <>
            {takeWords.map((word, index, words) => {
              const wordIndex = transcriptionIndex + index;
              return (
                <WordOuterComponent
                  key={`word-outer-${word.originalIndex}-${word.pasteKey}`}
                  word={word}
                  prevWord={wordIndex > 0 ? words[wordIndex - 1] : null}
                  nextWord={
                    wordIndex < words.length - 1 ? words[wordIndex + 1] : null
                  }
                  index={wordIndex}
                  mouse={mousePosition}
                  isPlaying={nowPlayingWordIndex === wordIndex}
                  isSelected={selectionSet.has(wordIndex)}
                  isPrevWordSelected={selectionSet.has(wordIndex - 1)}
                  isNextWordSelected={selectionSet.has(wordIndex + 1)}
                  onMouseDown={onWordMouseDown}
                  onMouseMove={onWordMouseMove}
                  isInInactiveTake={!isActive || !isTakeGroupOpened}
                  transcriptionLength={words.length}
                  {...passThroughProps}
                />
              );
            })}
          </>
        ) : null}
      </TakeWrapper>
    </>
  );
};

export default React.memo(TakeComponent);
