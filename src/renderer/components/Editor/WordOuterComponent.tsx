import { MousePosition } from '@react-hook/mouse-position';
import { Fragment } from 'react';
import { Word, Transcription } from 'sharedTypes';
import EditMarker from './EditMarker';
import WordComponent from './WordComponent';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordSpace from './WordSpace';

interface WordOuterComponentProps {
  word: Word;
  index: number;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  selectionSet: Set<any>;
  text: string;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState; // current state of ANY drag (null if no word being dragged)
  isWordBeingDragged: (wordIndex: number) => boolean;
  mouse: MousePosition;
  mouseThrottled: MousePosition;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: (index: number) => void;
  cancelDrag: () => void;
  submitWordEdit: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
}

const WordOuterComponent = ({
  word,
  index,
  transcription,
  seekToWord,
  selectionSet,
  onWordMouseDown,
  onWordMouseMove,
  dragState,
  isWordBeingDragged,
  mouse,
  mouseThrottled,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  submitWordEdit,
  editWord,
  nowPlayingWordIndex,
}: WordOuterComponentProps) => {
  return (
    <>
      {word.deleted ? (
        <EditMarker
          key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
          transcription={transcription}
          word={word}
          index={index}
        />
      ) : (
        <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
          <WordSpace
            key={`space-${word.originalIndex}-${word.pasteKey}`}
            isDropMarkerActive={dragState !== null && dropBeforeIndex === index}
          />
          <WordComponent
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            seekToWord={() => seekToWord(index)}
            isPlaying={index === nowPlayingWordIndex}
            isSelected={selectionSet.has(index)}
            text={word.word}
            index={index}
            onMouseDown={onWordMouseDown(index)}
            onMouseMove={() => onWordMouseMove(index)}
            dragState={dragState}
            isBeingDragged={isWordBeingDragged(index)}
            mouse={isWordBeingDragged(index) ? mouse : mouseThrottled}
            isDropBeforeActive={dropBeforeIndex === index}
            isDropAfterActive={dropBeforeIndex === index + 1}
            setDropBeforeIndex={setDropBeforeIndex}
            cancelDrag={cancelDrag}
            submitWordEdit={submitWordEdit}
            isBeingEdited={editWord?.index === index}
            editText={editWord?.text ?? null}
          />
          {index === transcription.words.length - 1 && (
            <WordSpace
              key="space-end"
              isDropMarkerActive={
                dragState !== null &&
                dropBeforeIndex === transcription.words.length
              }
            />
          )}
        </Fragment>
      )}
    </>
  );
};

export default WordOuterComponent;
