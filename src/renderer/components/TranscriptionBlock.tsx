import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';
import { selectionCleared } from '../store/selection/actions';
import DragCapture, { RenderTranscription } from './DragCapture';

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

  const space: (key: string) => JSX.Element = (key) => <span key={key}> </span>;

  const renderTranscription: RenderTranscription = (
    onWordMouseDown,
    onWordMouseUp,
    isWordBeingDragged,
    mouseX,
    mouseY,
  ) =>
    transcription.words.map((word, index) =>
      word.deleted ? null : (
        <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
          {index > 0 && space(`space-${word.originalIndex}-${word.pasteKey}`)}
          <Word
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            seekToWord={() => seekToWord(index)}
            isPlaying={index === nowPlayingWordIndex}
            isSelected={selectionSet.has(index)}
            text={word.word}
            index={index}
            onMouseDown={onWordMouseDown(index)}
            onMouseUp={onWordMouseUp(index)}
            isBeingDragged={isWordBeingDragged(index)}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </Fragment>
      )
    );

  return (
    <TranscriptionBox onClick={clearSelection}>
      <DragCapture renderTranscription={renderTranscription} />
    </TranscriptionBox>
  );
};

export default TranscriptionBlock;
