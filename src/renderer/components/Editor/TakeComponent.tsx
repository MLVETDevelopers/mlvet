import { MousePosition } from '@react-hook/mouse-position';
import { Take, Transcription } from 'sharedTypes';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TakeComponentProps {
  take: Take;
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
  transcriptionIndex: number;
}

const TakeComponent = ({
  take,
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
  transcriptionIndex,
}: TakeComponentProps) => {
  return (
    <>
      {take.words.map((word, index) => (
        <WordOuterComponent
          word={word}
          index={transcriptionIndex + index}
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
  );
};

export default TakeComponent;
