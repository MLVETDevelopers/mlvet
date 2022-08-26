import { Avatar } from '@mui/material';
import { Fragment, useState } from 'react';
import { TakeGroup, Word, Take } from 'sharedTypes';
import TakeGroupComponent from './TakeGroupComponent';

function instanceofTakeGroup(object: any): object is TakeGroup {
  return 'takes' in object;
}

interface TakeGroupComponentProps {
  takeGroup: TakeGroup;
}

interface TranscriptionChunkProps {
  chunk: Word | TakeGroup;
}

const TranscriptionChunk = ({ chunk }: TranscriptionChunkProps) => {
  return (
    <>
      {instanceofTakeGroup(chunk) ? (
        <TakeGroupComponent takeGroup={chunk as TakeGroup} />
      ) : (
        <>
          {word.deleted ? (
            <EditMarker
              key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
              transcription={transcription}
              word={word}
              index={index}
            />
          ) : (
            <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
              <WordSpace
                key={`space-${word.originalIndex}-${word.pasteKey}`}
                isDropMarkerActive={
                  dragState !== null && dropBeforeIndex === index
                }
              />
              <WordComponent
                key={`word-${word.originalIndex}-${word.pasteKey}`}
                seekToWord={() => seekToWord(index)}
                isPlaying={index === nowPlayingWordIndex}
                isSelected={selectionSet.has(index)}
                text={word.word}
                index={index}
                onMouseDown={onWordMouseDown(index)}
                onMouseMove={() => onWordMouseMove(index)}
                dragState={dragState}
                isBeingDragged={isWordBeingDragged(index)}
                mouse={isWordBeingDragged(index) ? mouse : mouseThrottled}
                isDropBeforeActive={dropBeforeIndex === index}
                isDropAfterActive={dropBeforeIndex === index + 1}
                setDropBeforeIndex={setDropBeforeIndex}
                cancelDrag={cancelDrag}
                submitWordEdit={submitWordEdit}
                isBeingEdited={editWord?.index === index}
                editText={editWord?.text ?? null}
              />
              {index === transcription.words.length - 1 && (
                <WordSpace
                  key="space-end"
                  isDropMarkerActive={
                    dragState !== null &&
                    dropBeforeIndex === transcription.words.length
                  }
                />
              )}
            </Fragment>
          )}
        </>
      )}
    </>
  );
};

export default TranscriptionChunk;
