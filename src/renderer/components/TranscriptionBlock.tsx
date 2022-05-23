import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
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
  time: number;
  onWordClick: (wordIndex: number) => void;
}

const TranscriptionBlock = ({ onWordClick, transcription, time }: Props) => {
  const [nowPlayingWordIndex, setNowPlayingWordIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const newPlayingWordIndex = transcription.words.findIndex(
      (word) =>
        time >= word.outputStartTime &&
        time <= word.outputStartTime + word.duration &&
        !word.deleted
    );
    if (newPlayingWordIndex !== nowPlayingWordIndex)
      setNowPlayingWordIndex(newPlayingWordIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, transcription]);

  return (
    <TranscriptionBox>
      <p
        style={{
          margin: 0,
        }}
      >
        {transcription.words.map((word, index) =>
          word.deleted ? null : (
            <Word
              key={word.key.toString()}
              data-index={index}
              data-type="word"
              onClick={() => {
                onWordClick(index);
              }}
              style={
                index === nowPlayingWordIndex
                  ? { background: `${colors.yellow[500]}80` }
                  : {}
              }
            >
              {word.word}
            </Word>
          )
        )}
      </p>
    </TranscriptionBox>
  );
};

export default TranscriptionBlock;
