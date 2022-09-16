import React from 'react';
import { isTakeGroup } from 'renderer/utils/takeDetection';
import { TakeGroup, Transcription, Word } from 'sharedTypes';
import TakeGroupComponent, {
  TranscriptionPassThroughProps,
} from './TakeGroupComponent';
import { WordMouseHandler } from './DragSelectManager';
import WordOuterComponent from './WordOuterComponent';

interface TranscriptionChunkProps extends TranscriptionPassThroughProps {
  chunk: Word | TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: (wordIndex: number) => void;
  nowPlayingWordIndex: number | null;
  selectionSet: Set<number>;
  transcription: Transcription;
}

const TranscriptionChunk = ({
  chunk,
  chunkIndex,
  onWordMouseDown,
  onWordMouseMove,
  nowPlayingWordIndex,
  selectionSet,
  transcription,
  ...passThroughProps
}: TranscriptionChunkProps) => {
  return isTakeGroup(chunk) ? (
    <TakeGroupComponent
      takeGroup={chunk as TakeGroup}
      chunkIndex={chunkIndex}
      onWordMouseDown={onWordMouseDown}
      onWordMouseMove={onWordMouseMove}
      nowPlayingWordIndex={nowPlayingWordIndex}
      selectionSet={selectionSet}
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
      isSelected={selectionSet.has(chunkIndex)}
      isPrevWordSelected={selectionSet.has(chunkIndex - 1)}
      isNextWordSelected={selectionSet.has(chunkIndex + 1)}
      onMouseDown={onWordMouseDown}
      onMouseMove={onWordMouseMove}
      isPlaying={nowPlayingWordIndex === chunkIndex}
      isInInactiveTake={false}
      transcriptionLength={transcription.words.length}
      {...passThroughProps}
    />
  );
};

export default React.memo(TranscriptionChunk);
