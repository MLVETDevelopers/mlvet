import { MousePosition } from '@react-hook/mouse-position';
import { MouseEventHandler, RefObject } from 'react';
import { Take, Transcription } from 'sharedTypes';
import { DragState } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TakeComponentProps {
  take: Take;
  transcription: Transcription;
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

const TakeComponent = ({
  take,
  transcription,
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
}: TakeComponentProps) => {
  return (
    <>
      {take.words.map((word, index) => (
        <WordOuterComponent
          word={word}
          index={index}
          transcription={transcription}
          seekToWord={seekToWord}
          isPlaying={isPlaying}
          isSelected={isSelected}
          text={text}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          dragState={dragState}
          isBeingDragged={isBeingDragged}
          mouse={mouse}
          isDropBeforeActive={isDropBeforeActive}
          isDropAfterActive={isDropAfterActive}
          setDropBeforeIndex={setDropBeforeIndex}
          cancelDrag={cancelDrag}
          submitWordEdit={submitWordEdit}
          isBeingEdited={isBeingEdited}
          editText={editText}
        />
      ))}
    </>
  );
};

export default TakeComponent;
