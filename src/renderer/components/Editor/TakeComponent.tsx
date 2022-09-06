import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { useDispatch } from 'react-redux';
import { selectTake } from 'renderer/store/takeGroups/actions';
import { TakeInfo, Transcription, Word } from 'sharedTypes';
import { RefObject, useMemo } from 'react';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

const makeTakeWrapper = (isTakeGroupOpened: boolean, isActive: boolean) =>
  styled(Box)({
    border: 'true',
    borderStyle: 'solid',
    borderWidth: '0px',
    borderLeftWidth: '2px',
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
  });

interface TakeComponentProps {
  takeWords: Word[];
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  setIsTakeGroupOpened: (isOpen: boolean) => void;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  mousePosition: MousePosition | null;
  mouseThrottled: MousePosition | null;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<any>;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  isWordBeingDragged: (wordIndex: number) => boolean;
  editWord: any;
  transcriptionIndex: number;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const TakeComponent = ({
  takeWords,
  takeIndex,
  isActive,
  isTakeGroupOpened,
  setIsTakeGroupOpened,
  transcription,
  seekToWord,
  dragState,
  mousePosition,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  submitWordEdit,
  nowPlayingWordIndex,
  selectionSet,
  onWordMouseDown,
  onWordMouseMove,
  isWordBeingDragged,
  mouseThrottled,
  editWord,
  transcriptionIndex,
  popoverWidth,
  transcriptionBlockRef,
}: TakeComponentProps) => {
  const dispatch = useDispatch();

  const onSelectTake = () => {
    dispatch(selectTake(takeWords[0].takeInfo as TakeInfo));
    setIsTakeGroupOpened(false);
  };

  const TakeWrapper = useMemo(
    () => makeTakeWrapper(isTakeGroupOpened, isActive),
    [isTakeGroupOpened, isActive]
  );

  const onClick = () => {
    if (isActive && !isTakeGroupOpened) {
      setIsTakeGroupOpened(true);
    } else {
      onSelectTake();
    }
  };

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
            {takeWords.map((word, index) => (
              <WordOuterComponent
                key={`word-outer-${word.originalIndex}-${word.pasteKey}`}
                word={word}
                index={transcriptionIndex + index}
                transcription={transcription}
                seekToWord={seekToWord}
                dragState={dragState}
                mouse={mousePosition}
                mouseThrottled={mouseThrottled}
                dropBeforeIndex={dropBeforeIndex}
                setDropBeforeIndex={setDropBeforeIndex}
                cancelDrag={cancelDrag}
                submitWordEdit={submitWordEdit}
                nowPlayingWordIndex={nowPlayingWordIndex}
                selectionSet={selectionSet}
                onWordMouseDown={onWordMouseDown}
                onWordMouseMove={onWordMouseMove}
                isWordBeingDragged={isWordBeingDragged}
                editWord={editWord}
                isInInactiveTake={!isActive || !isTakeGroupOpened}
                popoverWidth={popoverWidth}
                transcriptionBlockRef={transcriptionBlockRef}
              />
            ))}
          </>
        ) : null}
      </TakeWrapper>
    </>
  );
};

export default TakeComponent;
