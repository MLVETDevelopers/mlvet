import { Box } from '@mui/material';
import colors from 'renderer/colors';
import { IndexRange, Transcription, Word } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

interface Props {
  transcription: Transcription;
  word: Word;
  index: number;
  isSelected: boolean;
  onMarkerClick: (restoreRange: IndexRange) => void;
}

const EditMarker = ({
  transcription,
  word,
  index,
  isSelected,
  onMarkerClick,
}: Props) => {
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

  const getRestoreIndexRange = (): IndexRange => {
    let sectionEndIndex = index;
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

    return { startIndex: index, endIndex: sectionEndIndex + 1 };
  };

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <Box
      sx={{
        background: isSelected ? `${colors.blue[500]}cc` : 'none',
        transform: 'translateY(-6.5px)',
        cursor: 'pointer',
      }}
      onClick={() => onMarkerClick(getRestoreIndexRange())}
    >
      <EditMarkerSvg />
    </Box>
  ) : null;
};

export default EditMarker;
