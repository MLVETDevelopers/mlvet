import { MouseEventHandler } from 'react';
import { Transcription, Word } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

interface Props {
  transcription: Transcription;
  word: Word;
  index: number;
}

const EditMarker = ({ transcription, word, index }: Props) => {
  const isInOriginalPos = word.originalIndex === index;

  // word index has changed but still in the same relative position
  const hasNotMoved =
    index !== 0
      ? transcription.words[index - 1].originalIndex === word.originalIndex - 1
      : transcription.words[index + 1].originalIndex === word.originalIndex + 1;

  // preventing two markers from being next to each other
  const hasNoNeighbourMarker =
    index !== 0 ? !transcription.words[index - 1].deleted : true;

  const notPasted = word.pasteKey === 0;

  const onClick: MouseEventHandler<HTMLSpanElement> = () => {
    let sectionEndIndex = 1;
    for (let i = index; i < transcription.words.length - 1; i += 1) {
      const currWord = transcription.words[i];
      const nextWord = transcription.words[i + 1];
      if (
        !currWord.deleted ||
        !nextWord.deleted ||
        currWord.originalIndex + 1 !== nextWord.originalIndex
      )
        break;

      sectionEndIndex += 1;
    }

    console.log([...transcription.words].splice(index, sectionEndIndex));
  };

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <span role="button" tabIndex={index} onClick={onClick} onKeyDown={() => {}}>
      <EditMarkerSvg />
    </span>
  ) : null;
};

export default EditMarker;
