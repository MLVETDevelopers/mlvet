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
        {transcription.words
          .map((word, index) =>
            word.deleted ? null : (
              <Word
                key={word.key.toString()}
                data-index={index}
                data-type="word"
                onClick={() => {
                  onWordClick(index);
                }}
              >
                {word.word}
              </Word>
            )
          )
          .reduce((acc, curr) => (
            <>
              {acc} {curr}
            </>
          ))}
      </p>
    </TranscriptionBox>
  );
};

export default TranscriptionBlock;
