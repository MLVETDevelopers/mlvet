import { TakeGroup, Word } from 'sharedTypes';
import TakeGroupComponent from './TakeGroupComponent';
import WordOuterComponent from './WordOuterComponent';

function instanceofTakeGroup(object: any): object is TakeGroup {
  return 'takes' in object;
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
        <WordOuterComponent />
      )}
    </>
  );
};

export default TranscriptionChunk;
