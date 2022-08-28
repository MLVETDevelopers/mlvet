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
    const sectionToRestore = [...transcription.words].splice(index);

    // This returns the index of first word in the section to restore that is either
    // not deleted or does not fit within the original sequence. Since we are using a
    // spliced array with the first word being the start of the section we are restoring,
    // we can assume this value to be equal to the number of words we are restoring.
    const lastWordInSequenceIndex = sectionToRestore.findIndex(
      (currWord, i, array) => {
        // Condition if we hit the last word in the array
        if (i >= array.length - 1) return !currWord.deleted;

        const nextWord = array[i + 1];

        return (
          !currWord.deleted ||
          !nextWord.deleted ||
          currWord.originalIndex + 1 !== nextWord.originalIndex
        );
      }
    );

    console.log(index, lastWordInSequenceIndex + 1);

    // If the number of words to restore is -1, then we are restoring
    // from index until the end of the entire transcription.
    if (lastWordInSequenceIndex === -1) {
      return { startIndex: index, endIndex: transcription.words.length };
    }

    return { startIndex: index, endIndex: index + lastWordInSequenceIndex + 1 };
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
      onClick={() => onMarkerClick(getRestoreIndexRange(index))}
    >
      <EditMarkerSvg />
    </Box>
  ) : null;
};

export default EditMarker;
