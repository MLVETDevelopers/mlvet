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

  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(false);

  const testAvatarClick = (index: number, takeIndex: number) => {
    console.log(mockTranscription.words[index].activeTakes);
    console.log(`index: ${index.toString()}`);
    console.log(`takeIndex: ${takeIndex.toString()}`);
    mockTranscription.words[index].activeTakes = [takeIndex];
    console.log(mockTranscription.words[index].activeTakes);
    console.log('Avatar button clicked.');
    setIsTakeGroupOpened(false);
  };

  const openTakeGroup = () => {
    setIsTakeGroupOpened(true);
    console.log('Opened Take Group');
  };

  return (
    <>
      {mockTranscription.words.map((word, index) => {
        if (instanceofTakeGroup(word)) {
          return word.takes.map((take, takeIndex) => {
            return (
              <>
                {isTakeGroupOpened ? (
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
                  {word.activeTakes.includes(takeIndex) || isTakeGroupOpened
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
    </>
  );
};

export default TranscriptionBlock;
