import { Box } from '@mui/material';
import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import colors from 'renderer/colors';
import { Word } from 'sharedTypes';
import {
  getOriginalWords,
  getRestoreIndexRange,
  restoreOriginalSection,
} from 'renderer/editor/restore';
import { getColourForIndex } from 'renderer/utils/ui';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearRangeOverride,
  setRangeOverride,
  videoPlaying,
  videoSeek,
} from 'renderer/store/playback/actions';
import RestorePopover from './RestorePopover';
import EditMarkerSvg from '../../assets/EditMarkerSvg';

interface Props {
  word: Word;
  prevWord: Word | null;
  nextWord: Word | null;
  index: number;
  isSelected: boolean;
  selectedByClientWithIndex: number | null;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const EditMarker = ({
  word,
  prevWord,
  nextWord,
  index,
  isSelected,
  popoverWidth,
  transcriptionBlockRef,
  selectedByClientWithIndex,
}: Props) => {
  const [popperToggled, setPopperToggled] = useState<boolean | null>(false);
  const [popperText, setPopperText] = useState<string | null>(null);
  const dispatch = useDispatch();

  const markerRef = useRef<HTMLDivElement>(null);

  const isInOriginalPos = word.originalIndex === index;

  // word index has changed but still in the same relative position
  const hasNotMoved = useMemo(
    () =>
      prevWord === null
        ? nextWord?.originalIndex === word.originalIndex + 1
        : prevWord?.originalIndex === word.originalIndex - 1,
    [prevWord, nextWord, word]
  );

  // preventing two markers from being next to each other
  const hasNoNeighbourMarker = useMemo(
    () => prevWord === null || !prevWord.deleted,
    [prevWord]
  );

  const notPasted = word.pasteKey === 0;

  const words = useSelector(
    (store: ApplicationStore) =>
      store.currentProject?.transcription?.words ?? []
  );

  const getOriginalText = useCallback(() => {
    const originalWords = getOriginalWords(index, words);

    return originalWords;
  }, [index, words]);

  const onMarkerClick = useCallback(() => {
    setPopperToggled(true);

    const deletedWords = getOriginalText();
    const deletedText = deletedWords.map((w) => w.word).join(' ');

    const rangeOverride = getRestoreIndexRange(index, words);

    dispatch(setRangeOverride(rangeOverride));

    dispatch(videoPlaying({ isPlaying: true, lastUpdated: new Date() }));

    dispatch(videoSeek({ time: 0, lastUpdated: new Date() }));

    setPopperText(deletedText);
  }, [getOriginalText, index, words, dispatch]);

  const onClickAway = () => {
    setPopperToggled(false);

    dispatch(clearRangeOverride());

    dispatch(videoPlaying({ isPlaying: false, lastUpdated: new Date() }));

    dispatch(videoSeek({ time: 0, lastUpdated: new Date() }));
  };

  const background = useMemo(() => {
    if (isSelected) {
      return `${colors.blue[500]}cc`;
    }
    if (selectedByClientWithIndex !== null) {
      return `${getColourForIndex(selectedByClientWithIndex)}cc`;
    }
    return 'none';
  }, [isSelected, selectedByClientWithIndex]);

  const isShowingPopover = useMemo(
    () => (isInOriginalPos || hasNotMoved) && hasNoNeighbourMarker && notPasted,
    [isInOriginalPos, hasNotMoved, hasNoNeighbourMarker, notPasted]
  );

  return isShowingPopover ? (
    <>
      {popperToggled && (
        <RestorePopover
          text={popperText || ''}
          anchorEl={markerRef.current}
          onClickAway={onClickAway}
          width={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
          restoreText={() => {
            restoreOriginalSection(index);
          }}
        />
      )}
      <Box
        sx={{
          background,
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

export default React.memo(EditMarker);
