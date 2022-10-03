/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton, Stack, TextField } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { HighlightRange, Transcription } from 'sharedTypes';
import { useDispatch } from 'react-redux';
import {
  searchOccurrenceUpdated,
  SearchOccurrencePayload,
  SEARCH_CLOSED,
} from 'renderer/store/transcriptionFind/actions';

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

  const handleFindTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Algorithm
    // Loop through every Transcription Word
    // Loop through every Transcription Letter
    // Perform string match
    // First match will need to loop through every letter
    // General case can match full text
    // Last case will only need to check start of text
    // If match:
    // Set first match start and end indexes (start can be any index, end will be end)
    // Set general match start and end indexes (the whole word)
    // Set last match start and end indexes (start will be 0, end will be any index)
    // If only one word, then start and end can be any range

    const searchStr = event.target.value;
    if (searchStr.length === 0) return;

    const searchStrArray = searchStr.match(/\S+/g);
    if (searchStrArray === null) return;
    const searchStrArrayLength = searchStrArray.length;

    for (
      let wordIndex = 0;
      wordIndex < transcription.words.length - searchStrArrayLength + 1;
      wordIndex += 1
    ) {
      const word = transcription.words[wordIndex];
      let wordText = word.word;
      // TODO: Do a proper continue;
      // eslint-disable-next-line no-continue
      if (wordText === null) continue;
      let firstWordStartIndex = 0;
      let firstWordEndIndex = 0;
      let lastWordEndIndex = 0;

      for (
        let searchStrIndex = 0;
        searchStrIndex < searchStrArrayLength;
        searchStrIndex += 1
      ) {
        const currentSearchStr = searchStrArray[searchStrIndex];
        const currentSearchStrLength = currentSearchStr.length;
        wordText = transcription.words[wordIndex + searchStrIndex].word;
        if (wordText === null) {
          break;
        }

        if (searchStrIndex === 0 && searchStrArrayLength === 1) {
          // If only searching for a single word
          const startIndexes = [
            ...wordText.matchAll(new RegExp(currentSearchStr, 'gi')),
          ].map((match) => match.index);
          // TODO: Do proper undefined check
          if (startIndexes === undefined) {
            break;
          }
          const highlightedRanges = startIndexes.map((startIndex) => ({
            start: startIndex,
            end: startIndex + currentSearchStrLength,
          }));
          // console.log(wordIndex, highlightedRanges);
        } else if (searchStrIndex === 0) {
          // If first word of search string
          if (!wordText.endsWith(currentSearchStr)) break;
          firstWordStartIndex = wordText.length - currentSearchStrLength;
          firstWordEndIndex = wordText.length;
        } else if (searchStrIndex === searchStrArrayLength - 1) {
          // If last word of search string
          if (wordText.startsWith(currentSearchStr)) {
            // console.log('Started with last word');
            // Update transcription with highlighting information
            lastWordEndIndex = currentSearchStrLength;
            const valuesToUpdate = [];
            // TODO: Rewrite as .map()
            valuesToUpdate.push({
              start: firstWordStartIndex,
              end: firstWordEndIndex,
            } as HighlightRange);
            for (let i = 1; i < searchStrArrayLength - 1; i += 1) {
              valuesToUpdate.push({
                start: 0,
                end: wordText.length,
              } as HighlightRange);
            }
            valuesToUpdate.push({
              start: 0,
              end: lastWordEndIndex,
            });
            // console.log(wordIndex, valuesToUpdate);
            const searchPayload = {
              wordIndex,
              highlightRanges: valuesToUpdate,
            } as SearchOccurrencePayload;
            dispatch(searchOccurrenceUpdated(searchPayload));
          }
        } else if (wordText !== currentSearchStr) {
          // General case
          break;
        }
      }
    }
  };

  const nextOccurrence = () => {
    // TODO: Change CSS highlighting to highlight next word. If at end, go to beginning.
    // TODO: Make the page scroll to the highlighted word.
    // console.log('Next Word');
    // console.log(transcription);
  };

  const prevOccurrence = () => {
    // TODO: Change CSS highlighting to highlight previous word. If at beginning, go to end.
    // TODO: Make the page scroll to the highlighted word.
    // console.log('Prev Word');
    // console.log(searchOccurrences);
  };

  const handleClose = () => {
    dispatch(SEARCH_CLOSED);
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
