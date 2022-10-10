/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton, Stack, TextField } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { IndexRange, Transcription } from 'sharedTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  ctrlFindClosed,
  ctrlFindUpdated,
  CtrlFindUpdatePayload,
} from 'renderer/store/transcriptionFind/actions';
import { ApplicationStore } from 'renderer/store/sharedHelpers';

// Popover for Ctrl+F search

interface SearchBoxPopoverProps {
  transcription: Transcription;
  // anchorEl: HTMLElement | null;
  // width: number | null;
  // transcriptionBlockRef: RefObject<HTMLElement>;
}

const SearchBoxPopover = ({ transcription }: SearchBoxPopoverProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // console.log('handleClicked');
    setAnchorEl(event.currentTarget);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [totalFinds, setTotalFinds] = React.useState(0);
  const dispatch = useDispatch();
  const isShowingCtrlFPopover = useSelector(
    (store: ApplicationStore) => store.isShowingCtrlFPopover
  );
  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

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
    const searchStr = event.target.value;
    if (searchStr.length === 0) return;

    // Split by spaces
    const searchStrArray = searchStr.match(/\S+/g);
    if (searchStrArray === null) return;
    const searchStrArrayLength = searchStrArray.length;

    const payload: CtrlFindUpdatePayload = {
      indexRanges: [],
    };

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
        if (wordText === null) {
          break;
        }

        // If only searching for a single word
        if (j === 0 && searchStrArrayLength === 1) {
          console.log('Single word search');
          if (wordText.includes(currentSearchStr)) {
            const indexRange: IndexRange = {
              startIndex: i,
              endIndex: i,
            };
            payload.indexRanges.push(indexRange);
          }

          // If first word of search string
        } else if (j === 0) {
          console.log('First word of search string');
          if (!wordText.endsWith(currentSearchStr)) break;

          // If last word of search string
        } else if (j === searchStrArrayLength - 1) {
          console.log('Last word of search string');
          if (!wordText.startsWith(currentSearchStr)) break;
          const indexRange: IndexRange = {
            startIndex: i,
            endIndex: i + j,
          };
          payload.indexRanges.push(indexRange);
          // If any middle word of search string
        } else if (wordText !== currentSearchStr) break;
      }
    }
    console.log(payload);
    dispatch(ctrlFindUpdated(payload));
  };

  const nextOccurrence = () => {
    // TODO: Change CSS highlighting to highlight next word. If at end, go to beginning.
    // TODO: Make the page scroll to the highlighted word.
    // console.log('Next Word');
    console.log(transcription);
  };

  const prevOccurrence = () => {
    // TODO: Change CSS highlighting to highlight previous word. If at beginning, go to end.
    // TODO: Make the page scroll to the highlighted word.
    // console.log('Prev Word');
    // console.log(searchOccurrences);
    console.log(isShowingCtrlFPopover);
    console.log(isShowingConfidenceUnderlines);
  };

  const handleClose = () => {
    dispatch(ctrlFindClosed());
    // console.log('Close');
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Ctrl+F Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        // onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
          id="search-box-popover-layout-container"
          direction="row"
          sx={{
            gap: '2px',
            px: '2px',
            py: '2px',
          }}
        >
          <TextField
            sx={{ p: 1 }}
            id="standard-basic"
            variant="standard"
            onChange={handleFindTextChange}
          />
          <Typography>{totalFinds ? { currentIndex } : null}</Typography>
          {/* TODO: Insert a vertical line here if you want to make it look like Chrome's one */}
          <IconButton aria-label="next occurence" onClick={nextOccurrence}>
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton aria-label="previous occurrence" onClick={prevOccurrence}>
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton aria-label="close popover" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Popover>
    </div>
  );
};
export default SearchBoxPopover;
