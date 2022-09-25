import React from 'react';
import {
  IndexRange,
  TakeGroup,
  Transcription,
  TranscriptionChunk,
  Word,
} from 'sharedTypes';
import { isIndexInRange } from 'renderer/utils/range';
import { isTakeGroup } from 'sharedUtils';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import TakeGroupComponent, {
  TranscriptionPassThroughProps,
} from './TakeGroupComponent';
import { WordMouseHandler } from './DragSelectManager';
import WordOuterComponent from './WordOuterComponent';

const TranscriptionParagraph = styled(Box)({
  marginTop: 12,
  marginBottom: 12,
});

interface TranscriptionChunkProps extends TranscriptionPassThroughProps {
  chunk: TranscriptionChunk;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseEnter: (
    wordIndex: number,
    isWordSelected: boolean
  ) => (event: React.MouseEvent) => void;
  nowPlayingWordIndex: number | null;
  selection: IndexRange;
  transcription: Transcription;
}

const TranscriptionChunkComponent = ({
  chunk,
  chunkIndex,
  onWordMouseDown,
  onWordMouseEnter,
  nowPlayingWordIndex,
  selection,
  transcription,
  ...passThroughProps
}: TranscriptionChunkProps) => {
  return isTakeGroup(chunk) ? (
    <TakeGroupComponent
      takeGroup={chunk as TakeGroup}
      chunkIndex={chunkIndex}
      onWordMouseDown={onWordMouseDown}
      onWordMouseEnter={onWordMouseEnter}
      nowPlayingWordIndex={nowPlayingWordIndex}
      selection={selection}
      transcription={transcription}
      {...passThroughProps}
    />
  ) : (
    <TranscriptionParagraph>
      {(chunk as Word[]).map((word, index) => {
        const wordIndex = chunkIndex + index;

        return (
          <WordOuterComponent
            key={`word-outer-${word.originalIndex}-${word.pasteKey}`}
            word={word}
            prevWord={wordIndex > 0 ? transcription.words[wordIndex - 1] : null}
            nextWord={
              wordIndex < transcription.words.length - 1
                ? transcription.words[wordIndex + 1]
                : null
            }
            index={wordIndex}
            isPrevWordSelected={isIndexInRange(selection, wordIndex - 1)}
            isSelected={isIndexInRange(selection, wordIndex)}
            isNextWordSelected={isIndexInRange(selection, wordIndex + 1)}
            onMouseDown={onWordMouseDown}
            onMouseEnter={onWordMouseEnter}
            isPlaying={nowPlayingWordIndex === wordIndex}
            isInInactiveTake={false}
            transcriptionLength={transcription.words.length}
            {...passThroughProps}
          />
        );
      })}
    </TranscriptionParagraph>
  );
};

export default React.memo(TranscriptionChunkComponent);
