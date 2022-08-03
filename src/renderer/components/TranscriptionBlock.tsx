import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment } from 'react';
import { Transcription } from 'sharedTypes';
import colors from '../colors';
import Word from './Word';

const TranscriptionBox = styled(Box)`
  background: ${colors.grey[700]};
  border-radius: 5px;
  color: ${colors.grey[300]};
  overflow-y: scroll;
  height: 100%;
  padding: 20px;

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
  const space: (key: string) => JSX.Element = (key) => <span key={key}> </span>;

  const renderedTranscription = transcription.words.map((word, index) =>
    word.deleted ? null : (
      <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
        {index > 0 && space(`space-${word.originalIndex}-${word.pasteKey}`)}
        <Word
          key={`word-${word.originalIndex}-${word.pasteKey}`}
          seekToWord={() => seekToWord(index)}
          isPlaying={index === nowPlayingWordIndex}
          text={word.word}
          index={index}
        />
      </Fragment>
    )
  );

  return (
    <TranscriptionBox>
      <p
        style={{
          margin: 0,
        }}
      >
        {renderedTranscription}
      </p>
    </TranscriptionBox>
  );
};

export default TranscriptionBlock;
