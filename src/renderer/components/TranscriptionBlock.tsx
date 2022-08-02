import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Fragment } from 'react';
import { Transcription } from 'sharedTypes';
import colors from '../colors';

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

const Word = styled('span')`
  &:hover {
    color: ${colors.grey['000']};
    background: ${colors.yellow[500]}80;
  }
`;

interface Props {
  transcription: Transcription;
  nowPlayingWordIndex: number | null;
  onWordClick: (wordIndex: number) => void;
}

const TranscriptionBlock = ({
  onWordClick,
  transcription,
  nowPlayingWordIndex,
}: Props) => {
  const space: (key: string) => JSX.Element = (key) => <span key={key}> </span>;

  const renderedTranscription = transcription.words.map((word, index) =>
    word.deleted ? null : (
      <Fragment key={`${word.originalIndex}-${word.pasteCount}`}>
        {index > 0 && space(`space-${word.originalIndex}-${word.pasteCount}`)}
        <Word
          key={`word-${word.originalIndex}-${word.pasteCount}`}
          data-index={index}
          data-type="word"
          onClick={() => onWordClick(index)}
          style={
            index === nowPlayingWordIndex
              ? { background: `${colors.yellow[500]}` }
              : {}
          }
        >
          {word.word}
        </Word>
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
