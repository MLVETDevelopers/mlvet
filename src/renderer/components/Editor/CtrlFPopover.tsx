import Typography from '@mui/material/Typography';
import { IconButton, Paper, Stack, TextField } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { IndexRange, Transcription } from 'sharedTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  ctrlFindClosed,
  ctrlFindNext,
  ctrlFindPrev,
  ctrlFindUpdated,
  CtrlFindUpdatePayload,
} from 'renderer/store/ctrlFSelectionState/actions';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { ctrlFPopoverToggled } from 'renderer/store/ctrlFPopover/actions';
import colors from '../../colors';

// Popover for Ctrl+F search
interface SearchBoxPopoverProps {
  transcription: Transcription;
}

const SearchBoxPopover = ({ transcription }: SearchBoxPopoverProps) => {
  const dispatch = useDispatch();
  const ctrlFSelection = useSelector(
    (store: ApplicationStore) => store.ctrlFSelection
  );
  const { selectedIndex, maxIndex, indexRanges } = ctrlFSelection;

  const handleFindTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ctrl+F Search Algorithm
    // Splits words by spaces, and compares word-by-word
    const payload: CtrlFindUpdatePayload = {
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [],
    };

    const searchStr = event.target.value.toLowerCase();
    if (searchStr.length === 0) {
      dispatch(ctrlFindUpdated(payload));
      return;
    }
    // Split by spaces
    const searchStrArray = searchStr.match(/\S+/g);
    if (searchStrArray === null) return;
    const searchStrArrayLength = searchStrArray.length;

    // Loop through each word in the transcription
    const loopIter = transcription.words.length - searchStrArrayLength + 1;
    for (let i = 0; i < loopIter; i += 1) {
      const word = transcription.words[i];
      let wordText = word.word;
      // eslint-disable-next-line no-continue
      if (wordText === null) continue;

      // Loop through each word in the search string
      for (let j = 0; j < searchStrArrayLength; j += 1) {
        const currentSearchStr = searchStrArray[j];
        wordText = transcription.words[i + j].word;
        if (wordText === null) break;
        wordText = wordText.toLowerCase();

        // If last word of search string
        if (j === searchStrArrayLength - 1) {
          if (!wordText.startsWith(currentSearchStr)) break;
          const indexRange: IndexRange = {
            startIndex: i,
            endIndex: i + j + 1,
          };
          payload.indexRanges.push(indexRange);

          // If first word of search string
        } else if (j === 0) {
          if (!wordText.endsWith(currentSearchStr)) break;

          // If any middle word of search string
        } else if (wordText !== currentSearchStr) break;
      }
    }
    dispatch(ctrlFindUpdated(payload));
  };

  const nextOccurrence = () => {
    const payload: CtrlFindUpdatePayload = {
      selectedIndex,
      maxIndex,
      indexRanges,
    };
    dispatch(ctrlFindNext(payload));
  };

  const prevOccurrence = () => {
    const payload: CtrlFindUpdatePayload = {
      selectedIndex,
      maxIndex,
      indexRanges,
    };
    dispatch(ctrlFindPrev(payload));
  };

  const handleClose = () => {
    dispatch(ctrlFindClosed());
    dispatch(ctrlFPopoverToggled());
  };

  return (
    <Paper
      style={{
        position: 'absolute',
        right: 50,
        width: 350,
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
        zIndex: 1,
      }}
    >
      <Stack
        id="search-box-popover-layout-container"
        direction="row"
        sx={{
          gap: '2px',
          px: '2px',
          py: '2px',
          backgroundColor: colors.grey['700'],
          display: 'flex',
        }}
      >
        <TextField
          sx={{ p: 1 }}
          id="standard-basic"
          variant="standard"
          onChange={handleFindTextChange}
        />
        <Typography
          style={{
            color: colors.grey['000'],
            fontSize: '12px',
            alignSelf: 'center',
          }}
          alignItems="center"
          justifyContent="center"
        >
          {maxIndex > 0 ? `${selectedIndex + 1}/${maxIndex + 1}` : '0/0'}
        </Typography>
        {/* TODO: Insert a vertical line here if you want to make it look like Chrome's one */}
        <IconButton
          aria-label="previous occurrence"
          onClick={prevOccurrence}
          sx={{
            color: colors.grey['000'],
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton
          aria-label="next occurence"
          onClick={nextOccurrence}
          sx={{
            color: colors.grey['000'],
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
        <IconButton
          aria-label="close popover"
          onClick={handleClose}
          sx={{
            color: colors.grey['000'],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};
export default SearchBoxPopover;
