import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, RefObject, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';
import { selectionCleared } from '../store/selection/actions';
import DragManager, { RenderTranscription } from './WordDragManager';

interface Transcription {
  confidence: number;
  // words: Array<Word|Take|TakeGroup>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  words: Array<any>;
  duration: number;
}

// Renamed to IWord so it doesn't clash with the imported 'Word' component
interface IWord {
  // Text content of the word
  word: string;
  // Start time in the original transcript
  startTime: number;
  // Duration in the original transcript
  duration: number;
  // Start time for the actual playback, updated each time an edit is made
  outputStartTime: number;
  // Duration in seconds of any space before the word that we are counting as part of the word
  bufferDurationBefore: number;
  // Duration in seconds of any space after the word that we are counting as part of the word
  bufferDurationAfter: number;
  // Whether the word is marked as deleted
  deleted: boolean;
  // The position of the word in the original transcript
  originalIndex: number;
  // Zero if the word is in its original position;
  // higher if it has been pasted one or more times.
  // Used in combination with the originalIndex to produce a unique key
  pasteKey: number;
  // Used to differentiate between different projects/media;
  // TODO(chloe) this should be replaced with project ID or transcript ID
  // in order to support multiple projects without relying on a filename (which can change)
  fileName: string;
}

interface Take {
  words: IWord[];
}

interface TakeGroup {
  takes: Take[];
  activeTakes: number[];
}

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra eleifend lorem, et fermentum turpis eleifend non.
Vestibulum varius mi sed massa feugiat mattis non condimentum ante. Morbi et leo suscipit tellus aliquet ultricies. 
Proin at velit eget mauris maximus pellentesque ac eu velit. Morbi tincidunt bibendum ipsum et ullamcorper. 
Integer ornare eros a ante pulvinar consequat. Maecenas a ornare nunc. Cras ut nibh vulputate, consequat quam eu, 
condimentum urna. Nunc sed nisl non nunc accumsan luctus. Donec risus odio, ultrices vel consequat ut, maximus vulputate justo. 
Fusce nibh mauris, convallis non auctor mattis, semper sit amet velit. Mauris molestie quis tortor eget molestie. Donec tincidunt 
interdum mollis. Sed commodo et leo non feugiat. Curabitur elit turpis, pretium in sagittis eu, blandit et lacus.`;

const textWords = text.split(' ').map((word, index) => {
  return {
    word,
    startTime: index * 0.5,
    duration: 0.5,
    outputStartTime: index * 0.5,
    bufferDurationBefore: 0,
    bufferDurationAfter: 0,
    deleted: false,
    originalIndex: index,
    pasteKey: 0,
    fileName: 'test',
  } as IWord;
});

// console.log(textWords);
const take1 = 'The quick brown fox jumps over the lazy dog.';
const take2 = 'The fast brown fox jumped over the lazy dog.';

const take1Words = take1.split(' ').map((word, index) => {
  return {
    word,
    startTime: index * 0.5,
    duration: 0.5,
    outputStartTime: index * 0.5,
    bufferDurationBefore: 0,
    bufferDurationAfter: 0,
    deleted: false,
    originalIndex: index,
    pasteKey: 0,
    fileName: 'test',
  } as IWord;
});

const take2Words = take2.split(' ').map((word, index) => {
  return {
    word,
    startTime: index * 0.5,
    duration: 0.5,
    outputStartTime: index * 0.5,
    bufferDurationBefore: 0,
    bufferDurationAfter: 0,
    deleted: false,
    originalIndex: index,
    pasteKey: 0,
    fileName: 'test',
  } as IWord;
});

const take1Take: Take = {
  words: take1Words,
};

const take2Take: Take = {
  words: take2Words,
};

const takeGroup: TakeGroup = {
  takes: [take1Take, take2Take],
  activeTakes: [0, 1],
};

const singleTake =
  "This is a single take on it's own outside of any take groups.";
const singleTakeWords = singleTake.split(' ').map((word, index) => {
  return {
    word,
    startTime: index * 0.5 + 110,
    duration: 0.5,
    outputStartTime: index * 0.5 + 110,
    bufferDurationBefore: 0,
    bufferDurationAfter: 0,
    deleted: false,
    originalIndex: index,
    pasteKey: 0,
    fileName: 'test',
  } as IWord;
});

const takeMock: Take = {
  words: singleTakeWords,
};

const mockTranscription: Transcription = {
  confidence: 0.5,
  words: [],
  duration: 70,
};

textWords.forEach((e) => mockTranscription.words.push(e));
mockTranscription.words.push(takeGroup);
mockTranscription.words.push(takeMock);

/* console.log(mockTranscription.words[0])
console.log(mockTranscription.words.length)
console.log(mockTranscription.words[123]) */

const TranscriptionBox = styled(Box)({
  background: colors.grey[700],
  borderRadius: '5px',
  color: colors.grey[300],
  overflowX: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  padding: '20px',
  userSelect: 'none',

  '::-webkit-scrollbar': {
    width: '3px',
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: colors.yellow[500],
  },
});

/* const TakeDiv = styled('div')({
  take::before {

  }
}) */

interface Props {
  transcription: Transcription;
  nowPlayingWordIndex: number | null;
  seekToWord: (wordIndex: number) => void;
  containerRef: RefObject<HTMLDivElement>;
}

const TranscriptionBlock = ({
  seekToWord,
  transcription,
  nowPlayingWordIndex,
  containerRef,
}: Props) => {
  const selectionArray = useSelector(
    (store: ApplicationStore) => store.selection
  );

  function instanceofIWord(object: any): object is IWord {
    return 'word' in object;
  }

  function instanceofTake(object: any): object is Take {
    return 'words' in object;
  }

  function instanceofTakeGroup(object: any): object is TakeGroup {
    return 'takes' in object;
  }

  const selectionSet = useMemo(() => new Set(selectionArray), [selectionArray]);

  const dispatch = useDispatch();

  const clearSelection: (
    dragSelectAnchor: number | null,
    clearAnchor: () => void
  ) => void = (dragSelectAnchor, clearAnchor) => {
    if (dragSelectAnchor == null) {
      dispatch(selectionCleared());
    } else {
      clearAnchor();
    }
  };

  const space: (key: string, isDropMarkerActive: boolean) => JSX.Element =
    useMemo(
      () => (key, isDropMarkerActive) =>
        (
          <span
            key={key}
            style={{
              background: isDropMarkerActive ? 'white' : 'none',
              transition: 'background 0.2s',
              width: '2px',
              paddingLeft: '1px',
              paddingRight: '1px',
            }}
          />
        ),
      []
    );

  const renderTranscription: RenderTranscription = (
    onWordMouseDown,
    onWordMouseMove,
    dragState,
    isWordBeingDragged,
    mouse,
    mouseThrottled,
    dropBeforeIndex,
    setDropBeforeIndex,
    cancelDrag,
    dragSelectAnchor,
    setDragSelectAnchor
  ) => (
    <TranscriptionBox
      onMouseUp={() =>
        clearSelection(dragSelectAnchor, () => setDragSelectAnchor(null))
      }
    >
      {mockTranscription.words.map((word, index) => {
        if (instanceofTakeGroup(word)) {
          return word.activeTakes.map((takeIndex) => {
            return (
              <div
                id="take"
                style={{
                  border: 'true',
                  borderStyle: 'solid',
                  borderWidth: '0px',
                  borderLeftWidth: '2px',
                  borderColor: 'yellow',
                }}
              >
                {word.takes[takeIndex].words.map((wordA, indexA) => {
                  return wordA.deleted ? null : (
                    <Fragment key={`${wordA.originalIndex}-${wordA.pasteKey}`}>
                      {space(
                        `space-${wordA.originalIndex}-${wordA.pasteKey}`,
                        dragState !== null && dropBeforeIndex === indexA
                      )}
                      <Word
                        key={`word-${wordA.originalIndex}-${wordA.pasteKey}`}
                        seekToWord={() => seekToWord(indexA)}
                        isPlaying={indexA === nowPlayingWordIndex}
                        isSelected={selectionSet.has(indexA)}
                        text={wordA.word}
                        index={indexA}
                        onMouseDown={onWordMouseDown(indexA)}
                        onMouseMove={() => onWordMouseMove(indexA)}
                        dragState={dragState}
                        isBeingDragged={isWordBeingDragged(indexA)}
                        mouse={
                          isWordBeingDragged(indexA) ? mouse : mouseThrottled
                        }
                        isDropBeforeActive={dropBeforeIndex === indexA}
                        isDropAfterActive={dropBeforeIndex === indexA + 1}
                        setDropBeforeIndex={setDropBeforeIndex}
                        cancelDrag={cancelDrag}
                      />
                      {indexA === transcription.words.length - 1 &&
                        space(
                          `space-end`,
                          dragState !== null &&
                            dropBeforeIndex === transcription.words.length
                        )}
                    </Fragment>
                  );
                })}
              </div>
            );
          });
        }

        if (instanceofTake(word)) {
          return (
            <div
              id="take"
              style={{
                border: 'true',
                borderStyle: 'solid',
                borderWidth: '0px',
                borderLeftWidth: '2px',
                borderColor: 'yellow',
              }}
            >
              {word.words.map((wordA, indexA) => {
                return wordA.deleted ? null : (
                  <Fragment key={`${wordA.originalIndex}-${wordA.pasteKey}`}>
                    {space(
                      `space-${wordA.originalIndex}-${wordA.pasteKey}`,
                      dragState !== null && dropBeforeIndex === indexA
                    )}
                    <Word
                      key={`word-${wordA.originalIndex}-${wordA.pasteKey}`}
                      seekToWord={() => seekToWord(indexA)}
                      isPlaying={indexA === nowPlayingWordIndex}
                      isSelected={selectionSet.has(indexA)}
                      text={wordA.word}
                      index={indexA}
                      onMouseDown={onWordMouseDown(indexA)}
                      onMouseMove={() => onWordMouseMove(indexA)}
                      dragState={dragState}
                      isBeingDragged={isWordBeingDragged(indexA)}
                      mouse={
                        isWordBeingDragged(indexA) ? mouse : mouseThrottled
                      }
                      isDropBeforeActive={dropBeforeIndex === indexA}
                      isDropAfterActive={dropBeforeIndex === indexA + 1}
                      setDropBeforeIndex={setDropBeforeIndex}
                      cancelDrag={cancelDrag}
                    />
                    {indexA === transcription.words.length - 1 &&
                      space(
                        `space-end`,
                        dragState !== null &&
                          dropBeforeIndex === transcription.words.length
                      )}
                  </Fragment>
                );
              })}
            </div>
          );
        }

        return word.deleted ? null : (
          <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
            {space(
              `space-${word.originalIndex}-${word.pasteKey}`,
              dragState !== null && dropBeforeIndex === index
            )}
            <Word
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
            />
            {index === transcription.words.length - 1 &&
              space(
                `space-end`,
                dragState !== null &&
                  dropBeforeIndex === transcription.words.length
              )}
          </Fragment>
        );
      })}
    </TranscriptionBox>
  );

  return (
    <DragManager
      renderTranscription={renderTranscription}
      containerRef={containerRef}
    />
  );
};

export default TranscriptionBlock;
