import { Fragment } from 'react';
import EditMarker from './EditMarker';
import WordComponent from './WordComponent';
import WordSpace from './WordSpace';

interface WordOuterComponentProps {
  word: Word;
  index: number;
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

const WordOuterComponent = ({
  word,
  index,
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
