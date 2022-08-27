import { Avatar } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { useDispatch } from 'react-redux';
import { selectTake } from 'renderer/store/takeDetection/actions';
import { TakeInfo, Transcription, Word } from 'sharedTypes';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TakeComponentProps {
  takeWords: Word[];
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  setIsTakeGroupOpened: (isOpen: boolean) => void;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  mousePosition: MousePosition;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<any>;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouseThrottled: MousePosition;
  editWord: any;
  transcriptionIndex: number;
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
}: TakeComponentProps) => {
  console.log(takeWords);

  const dispatch = useDispatch();

  const onSelectTake = () => {
    dispatch(selectTake(takeWords[0].takeInfo as TakeInfo));
    setIsTakeGroupOpened(false);
  };

  return (
    <>
      {isTakeGroupOpened ? (
        <Avatar
          onClick={onSelectTake}
          sx={{
            height: 22,
            width: 22,
            fontSize: 12,
            color: '#1D201F',
            bgcolor: isActive ? '#FFB355' : '#ABA9A9',
          }}
        >
          {takeIndex + 1}
        </Avatar>
      ) : null}

      <Avatar
        onClick={() => setIsTakeGroupOpened(true)}
        style={{
          width: '10px',
          height: '10px',
          borderWidth: '0px',
          borderLeftWidth: '2px',
          backgroundColor: 'green',
          display: 'block',
        }}
      />
      <div
        className="take"
        style={{
          border: 'true',
          borderStyle: 'solid',
          borderWidth: '0px',
          borderLeftWidth: '2px',
          borderColor: '#FFB355',
        }}
      >
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
                dropBeforeIndex={dropBeforeIndex}
                setDropBeforeIndex={setDropBeforeIndex}
                cancelDrag={cancelDrag}
                submitWordEdit={submitWordEdit}
                nowPlayingWordIndex={nowPlayingWordIndex}
                selectionSet={selectionSet}
                onWordMouseDown={onWordMouseDown}
                onWordMouseMove={onWordMouseMove}
                isWordBeingDragged={isWordBeingDragged}
                mouseThrottled={mouseThrottled}
                editWord={editWord}
              />
            ))}
          </>
        ) : null}
      </div>
    </>
  );
};

export default TakeComponent;
