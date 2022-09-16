import React from 'react';
import { isTakeGroup } from 'renderer/utils/takeDetection';
import { IndexRange, TakeGroup, Transcription, Word } from 'sharedTypes';
import { isIndexInRange } from 'renderer/utils/range';
import TakeGroupComponent, {
  TranscriptionPassThroughProps,
} from './TakeGroupComponent';
import { WordMouseHandler } from './DragSelectManager';
import WordOuterComponent from './WordOuterComponent';

interface TranscriptionChunkProps extends TranscriptionPassThroughProps {
  chunk: Word | TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseEnter: (wordIndex: number) => void;
  nowPlayingWordIndex: number | null;
  selection: IndexRange;
  transcription: Transcription;
}

const TranscriptionChunk = ({
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
    <WordOuterComponent
      word={chunk as Word}
      prevWord={chunkIndex > 0 ? transcription.words[chunkIndex - 1] : null}
      nextWord={
        chunkIndex < transcription.words.length - 1
          ? transcription.words[chunkIndex + 1]
          : null
      }
      index={chunkIndex}
      isPrevWordSelected={isIndexInRange(selection, chunkIndex - 1)}
      isSelected={isIndexInRange(selection, chunkIndex)}
      isNextWordSelected={isIndexInRange(selection, chunkIndex + 1)}
      onMouseDown={onWordMouseDown}
      onMouseEnter={onWordMouseEnter}
      isPlaying={nowPlayingWordIndex === chunkIndex}
      isInInactiveTake={false}
      transcriptionLength={transcription.words.length}
      {...passThroughProps}
    />
  );
};

export default React.memo(TranscriptionChunk);
