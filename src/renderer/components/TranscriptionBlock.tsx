import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Transcription } from 'sharedTypes';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import Word from './Word';

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

  const space: (key: string) => JSX.Element = (key) => <span key={key}> </span>;

  const renderedTranscription = transcription.words.map((word, index) =>
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
        />
      </Fragment>
    )
  );

  return <TranscriptionBox>{renderedTranscription}</TranscriptionBox>;
};

export default TranscriptionBlock;
