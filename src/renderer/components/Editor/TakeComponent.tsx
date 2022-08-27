import { Fragment } from 'react';
import { Take } from 'sharedTypes';
import EditMarker from './EditMarker';
import TranscriptionChunk from './TranscriptionChunk';
import WordComponent from './WordComponent';
import WordOuterComponent from './WordOuterComponent';
import WordSpace from './WordSpace';

interface TakeComponentProps {
  take: Take;
}

const TakeComponent = ({ take }: TakeComponentProps) => {
  return (
    <>
      {take.words.map((word) => (
        <WordOuterComponent word={word} />
      ))}
    </>
  );
};

export default TakeComponent;
