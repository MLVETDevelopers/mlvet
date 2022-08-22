import { Transcription, WordComponent } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

interface Props {
  transcription: Transcription;
  word: WordComponent;
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

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <EditMarkerSvg />
  ) : null;
};

export default EditMarker;
