import styled from '@emotion/styled';
import { Box, colors } from '@mui/material';
import { Transcription } from 'sharedTypes';

const TranscriptionBox = styled(Box)`
  background: ${colors.common.white};
  height: 100%;
  padding: 20px;
`;

const Word = styled('span')`
  &:hover {
    background: orange;
  }
`;

interface Props {
  transcription: Transcription;
  onWordClick: (wordIndex: number) => void;
}

const TranscriptionBlock = ({ onWordClick, transcription }: Props) => {
  return (
    <TranscriptionBox>
      <p>
        {transcription.words.map((word, index) => (
          <Word
            key={word.key.toString()}
            data-index={index}
            data-type="word"
            onClick={() => {
              onWordClick(index);
            }}
          >
            {`${word.word} `}
          </Word>
        ))}
      </p>
    </TranscriptionBox>
  );
};

export default TranscriptionBlock;
