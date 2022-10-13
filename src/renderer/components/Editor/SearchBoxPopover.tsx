/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import Popper from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { IconButton, Stack, TextField } from '@mui/material';
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
  // anchorEl: HTMLElement | null;
  // width: number | null;
  // transcriptionBlockRef: RefObject<HTMLElement>;
}

const SearchBoxPopover = ({ transcription }: SearchBoxPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const isShowingCtrlFPopover = useSelector(
    (store: ApplicationStore) => store.isShowingCtrlFPopover
  );
  const ctrlFSelection = useSelector(
    (store: ApplicationStore) => store.ctrlFSelection
  );
  const { selectedIndex, maxIndex, indexRanges } = ctrlFSelection;
  const handleFindTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Algorithm
    // Loop through every Transcription Word, if word is deleted, continue.
    // Loop through every SearchStr Word
    // If SearchStr is only 1 word, then use .includes. Send word index to reducer if so.
    // First match will need to loop through every letter
    // General case can match full text
    // Last case will only need to check start of text
    // If match:
    // Set first match start and end indexes (start can be any index, end will be end)
    // Set general match start and end indexes (the whole word)
    // Set last match start and end indexes (start will be 0, end will be any index)
    // If only one word, then start and end can be any range
    // Empty search string
    const payload: CtrlFindUpdatePayload = {
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [],
    };

    const searchStr = event.target.value;
    if (searchStr.length === 0) {
      dispatch(ctrlFindUpdated(payload));
      return;
    }
    // Split by spaces
    const searchStrArray = searchStr.match(/\S+/g);
    if (searchStrArray === null) return;
    const searchStrArrayLength = searchStrArray.length;
    console.log(searchStrArray);

    // Loop through each word in the transcription
    const loopIter = transcription.words.length - searchStrArrayLength + 1;
    for (let i = 0; i < loopIter; i += 1) {
      const word = transcription.words[i];
      let wordText = word.word;
      // TODO: Do a proper continue;
      // eslint-disable-next-line no-continue
      if (wordText === null) continue;

      // Loop through each word in the search string
      for (let j = 0; j < searchStrArrayLength; j += 1) {
        const currentSearchStr = searchStrArray[j];
        wordText = transcription.words[i + j].word;
        if (wordText === null) break;

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
    console.log(payload);
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

  const id = isShowingCtrlFPopover ? 'simple-popover' : undefined;

  return (
    <>
      <Popper
        id={id}
        open={isShowingCtrlFPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorPosition={{ top: 200, left: 100 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
            }}
            alignItems="center"
            justifyContent="center"
          >
            {maxIndex > 0 ? `${selectedIndex + 1}/${maxIndex + 1}` : '0/0'}
          </Typography>
          {/* TODO: Insert a vertical line here if you want to make it look like Chrome's one */}
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
            aria-label="previous occurrence"
            onClick={prevOccurrence}
            sx={{
              color: colors.grey['000'],
            }}
          >
            <KeyboardArrowUpIcon />
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
      </Popper>
    </>
  );
};
export default SearchBoxPopover;
