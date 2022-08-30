import { Box } from '@mui/material';
import { RefObject, useRef, useState } from 'react';
import colors from 'renderer/colors';
import { IndexRange, Transcription, Word } from 'sharedTypes';
import EditMarkerSvg from '../../assets/EditMarkerSvg';
import RestorePopover from './RestorePopover';

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

  const onMarkerClick = () => {
    setPopperToggled(true);
    setPopperText(
      'Today is a recap on what we`ve done so far on all the groups - this is an opportunity if there are any roadblocks, and we will have a retrospective, and any questions for research proposal/presentation'
    );
  };

  return (isInOriginalPos || hasNotMoved) &&
    hasNoNeighbourMarker &&
    notPasted ? (
    <>
      {popperToggled && (
        <RestorePopover
          text={popperText || ''}
          anchorEl={markerRef.current}
          onClickAway={() => {
            setPopperToggled(false);
          }}
          width={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
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
