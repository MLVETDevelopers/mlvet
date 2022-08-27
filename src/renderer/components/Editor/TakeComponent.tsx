import { Avatar } from '@mui/material';
import { MousePosition } from '@react-hook/mouse-position';
import { Take, Transcription } from 'sharedTypes';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TakeComponentProps {
  take: Take;
  takeIndex: number;
  isActive: boolean;
  isTakeGroupOpened: boolean;
  openTakeGroup: () => void;
  transcription: Transcription;
  seekToWord: () => void;
  text: string;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  mouse: MousePosition;
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
}

const TakeComponent = ({
  take,
  takeIndex,
  isActive,
  isTakeGroupOpened,
  openTakeGroup,
  transcription,
  seekToWord,
  text,
  dragState,
  mouse,
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
}: TakeComponentProps) => {
  return (
    <>
      {isTakeGroupOpened ? (
        <Avatar
          onClick={() => console.log(take, takeIndex)}
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
        onClick={openTakeGroup}
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
            {take.words.map((word, index) => (
              <WordOuterComponent
                word={word}
                index={index}
                transcription={transcription}
                seekToWord={seekToWord}
                text={text}
                dragState={dragState}
                mouse={mouse}
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
