import styled from '@emotion/styled';
import { Box } from '@mui/material';
import colors from 'renderer/colors';
import { Transcription, Word } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

const makeEditMarkerContainer = (isSelected: boolean) =>
  styled(Box)({
    background: isSelected ? `${colors.blue[500]}cc` : 'none',

    // a bit gross but a seemingly unavoidable consequence of
    // using a centre-aligned flexbox for the word and space items -
    // tried everything else in the book and this is the best I could
    // come up with
    transform: 'translateY(-6.5px)',
  });

interface Props {
  transcription: Transcription;
  word: Word;
  index: number;
  isSelected: boolean;
}

const EditMarker = ({ transcription, word, index, isSelected }: Props) => {
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

  const EditMarkerContainer = makeEditMarkerContainer(isSelected);

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
    <EditMarkerContainer onClick={onClick}>
      <EditMarkerSvg />
    </EditMarkerContainer>
  ) : null;
};

export default EditMarker;
