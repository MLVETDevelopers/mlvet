import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { Fragment, RefObject, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';
import { selectionCleared } from '../store/selection/actions';
import DragManager, { RenderTranscription } from './WordDragManager';
import './TranscriptionBlock.css';

interface Transcription {
  confidence: number;
  // words: Array<Word|Take|TakeGroup>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  words: Array<any>;
  duration: number;
}

// Renamed to IWord so it doesn't clash with the imported 'Word' component
interface IWord {
  word: string;
  startTime: number;
  duration: number;
  outputStartTime: number;
  bufferDurationBefore: number;
  bufferDurationAfter: number;
  deleted: boolean;
  originalIndex: number;
  pasteKey: number;
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
Proin at velit eget mauris maximus pellentesque ac eu velit. Morbi tincidunt bibendum ipsum et ullamcorper.`;

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
const take1 =
  'This is the first take in this take group and the quick brown fox jumps over the lazy dog.';
const take2 =
  'This is the second take in this take group and the fast brown fox jumped over the lazy dog.';

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
  'This is a single take on its own outside of any take groups.';
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

const mockTranscription: Transcription = {
  confidence: 0.5,
  words: [],
  duration: 70,
};

textWords.forEach((e) => mockTranscription.words.push(e));
mockTranscription.words.push(takeGroup);

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

  const [takeGroupOpened, setTakeGroupOpened] = useState(false);

  function instanceofIWord(object: any): object is IWord {
    return 'word' in object;
  }

  function instanceofTake(object: any): object is Take {
    return 'words' in object;
  }

  function instanceofTakeGroup(object: any): object is TakeGroup {
    return 'takes' in object;
  }

  const testAvatarClick = (index: number, takeIndex: number) => {
    console.log(mockTranscription.words[index].activeTakes);
    console.log(`index: ${index.toString()}`);
    console.log(`takeIndex: ${takeIndex.toString()}`);
    mockTranscription.words[index].activeTakes = [takeIndex];
    console.log(mockTranscription.words[index].activeTakes);
    console.log('Avatar button clicked.');
    setTakeGroupOpened(false);
  };

  const openTakeGroup = () => {
    setTakeGroupOpened(true);
    console.log('Opened Take Group');
  };

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
          return word.takes.map((take, takeIndex) => {
            return (
              <>
                {takeGroupOpened ? (
                  <Avatar
                    onClick={() => testAvatarClick(index, takeIndex)}
                    sx={{
                      height: 22,
                      width: 22,
                      fontSize: 12,
                      color: '#1D201F',
                      bgcolor: word.activeTakes.includes(takeIndex)
                        ? '#FFB355'
                        : '#ABA9A9',
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
                  {word.activeTakes.includes(takeIndex) || takeGroupOpened
                    ? word.takes[takeIndex].words.map((wordA, indexA) => {
                        return wordA.deleted ? null : (
                          <Fragment
                            key={`${wordA.originalIndex}-${wordA.pasteKey}`}
                          >
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
                                isWordBeingDragged(indexA)
                                  ? mouse
                                  : mouseThrottled
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
                      })
                    : null}
                </div>
              </>
            );
          });
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
