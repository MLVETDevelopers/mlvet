import { Box } from '@mui/material';
import { RefObject, useRef, useState } from 'react';
import colors from 'renderer/colors';
import { Transcription, Word } from 'sharedTypes';
import {
  getOriginalWords,
  restoreOriginalSection,
} from 'renderer/editor/restore';
import RestorePopover from './RestorePopover';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

interface Props {
  transcription: Transcription;
  word: Word;
  index: number;
  isSelected: boolean;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const EditMarker = ({
  transcription,
  word,
  index,
  isSelected,
  popoverWidth,
  transcriptionBlockRef,
}: Props) => {
  const [popperToggled, setPopperToggled] = useState<boolean | null>(false);
  const [popperText, setPopperText] = useState<string | null>(null);

  const markerRef = useRef<HTMLDivElement>(null);

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

  const getOriginalText = () => {
    const originalWords = getOriginalWords(index, transcription.words);
    const originalText = originalWords.map((w) => w.word).join(' ');

    return originalText;
  };

  const onMarkerClick = () => {
    setPopperToggled(true);
    setPopperText(getOriginalText());
  };

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <>
      {popperToggled && (
        <RestorePopover
          text={popperText || ''}
          anchorEl={markerRef.current}
          onClickAway={() => setPopperToggled(false)}
          width={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
          restoreText={() => {
            restoreOriginalSection(index);
          }}
        />
      )}
      <Box
        sx={{
          background: isSelected ? `${colors.blue[500]}cc` : 'none',
          transform: 'translateY(-6.5px)',
          cursor: 'pointer',
        }}
        onClick={onMarkerClick}
        ref={markerRef}
      >
        <EditMarkerSvg />
      </Box>
    </>
  ) : null;
};

export default EditMarker;
