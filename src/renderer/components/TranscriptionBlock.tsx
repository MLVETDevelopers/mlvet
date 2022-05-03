import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Transcription } from 'sharedTypes';

const TranscriptionBlock = (props: {
  transcription: Transcription;
  onWordClick: (wordIndex: number) => void;
}) => {
  const { onWordClick, transcription } = props;

  const Word = styled('span')`
    &:hover {
      background: orange;
    }
  `;

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#FFFFFF',
        height: '100%',
      }}
    >
      <p>
        {transcription.words.map((word, index) => (
          <Word
            key={word.startTime.toString()}
            data-index={index}
            onClick={() => {
              onWordClick(index);
            }}
          >
            {`${word.word} `}
          </Word>
        ))}
      </p>
    </Box>
  );
};

export default TranscriptionBlock;
