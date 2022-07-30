import styled from '@emotion/styled';
import { Box } from '@mui/material';
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
  const space = <span> </span>;

  const wordsWithAppendedSpaces = transcription.words.map((word, index) =>
    word.deleted ? null : (
      <>
        <Word
          key={word.key}
          data-index={index}
          data-type="word"
          onClick={() => {
            onWordClick(index);
          }}
          style={
            index === nowPlayingWordIndex
              ? { background: `${colors.yellow[500]}` }
              : {}
          }
        >
          {word.word}
        </Word>
        {space}
      </>
    )
  );

  const renderedTranscription = [space].concat(
    wordsWithAppendedSpaces.filter(Boolean) as ConcatArray<JSX.Element>
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
