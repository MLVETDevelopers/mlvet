import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';
import { selectionCleared } from '../store/selection/actions';
import DragManager, { RenderTranscription } from './DragManager';

const TranscriptionBox = styled(Box)`
  background: ${colors.grey[700]};
  border-radius: 5px;
  color: ${colors.grey[300]};
  overflow-y: scroll;
  height: 100%;
  padding: 20px;
  user-select: none;

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${colors.yellow[500]};
  }
`;

interface Props {
  transcription: Transcription;
  nowPlayingWordIndex: number | null;
  seekToWord: (wordIndex: number) => void;
}

const TranscriptionBlock = ({
  seekToWord,
  transcription,
  nowPlayingWordIndex,
}: Props) => {
  const selectionArray = useSelector(
    (store: ApplicationStore) => store.selection
  );

  const selectionSet = useMemo(() => new Set(selectionArray), [selectionArray]);

  const dispatch = useDispatch();

  const clearSelection: () => void = () => {
    dispatch(selectionCleared());
  };

  const space: (key: string, isDropMarkerActive: boolean) => JSX.Element = (
    key,
    isDropMarkerActive
  ) => (
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
  );

  const renderTranscription: RenderTranscription = (
    onWordMouseDown,
    dragState,
    isWordBeingDragged,
    mouse,
    mouseThrottled,
    dropBeforeIndex,
    setDropBeforeIndex
  ) => (
    <TranscriptionBox onClick={clearSelection}>
      {transcription.words.map((word, index) =>
        word.deleted ? null : (
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
              dragState={dragState}
              isBeingDragged={isWordBeingDragged(index)}
              mouse={isWordBeingDragged(index) ? mouse : mouseThrottled}
              isDropBeforeActive={dropBeforeIndex === index}
              isDropAfterActive={dropBeforeIndex === index + 1}
              setDropBeforeIndex={setDropBeforeIndex}
            />
            {index === transcription.words.length - 1 &&
              space(
                `space-end`,
                dragState !== null &&
                  dropBeforeIndex === transcription.words.length
              )}
          </Fragment>
        )
      )}
    </TranscriptionBox>
  );

  return (
    <DragManager
      seekToWord={seekToWord}
      renderTranscription={renderTranscription}
    />
  );
};

export default TranscriptionBlock;
