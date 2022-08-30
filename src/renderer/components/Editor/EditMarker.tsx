import { Box } from '@mui/material';
import colors from 'renderer/colors';
import { restoreOriginalSection } from 'renderer/editor/restore';
import { Transcription, Word } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

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

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <Box
      sx={{
        background: isSelected ? `${colors.blue[500]}cc` : 'none',
        transform: 'translateY(-6.5px)',
        cursor: 'pointer',
      }}
      onClick={() => restoreOriginalSection(index)}
    >
      <EditMarkerSvg />
    </Box>
  ) : null;
};

export default EditMarker;
