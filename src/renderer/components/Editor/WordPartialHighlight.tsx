import { Box } from '@mui/material';
import { RefObject } from 'react';
import colors from 'renderer/colors';
import { getCanvasFont, getTextWidth } from 'renderer/utils/ui';
import { PartialSelectState } from './DragSelectManager';

interface Props {
  wordRef: RefObject<HTMLDivElement>;
  text: string;
  partialSelectState: PartialSelectState;
}

const WordPartialHighlight = ({ wordRef, text, partialSelectState }: Props) => {
  const { anchorLetterIndex, currentLetterIndex } = partialSelectState;

  const minIndex = Math.min(anchorLetterIndex, currentLetterIndex);
  const maxIndex = Math.max(anchorLetterIndex, currentLetterIndex);

  const leftOffset =
    getTextWidth(text.slice(0, minIndex), getCanvasFont(wordRef.current)) ?? 0;

  const width =
    getTextWidth(
      text.slice(minIndex, maxIndex + 1),
      getCanvasFont(wordRef.current)
    ) ?? 0;

  const height = wordRef.current?.getBoundingClientRect().height || 0;

  return (
    <Box
      sx={{
        left: leftOffset,
        width: width + 4,
        height,
        position: 'absolute',
        top: '0',
        zIndex: -1,
        background: `${colors.blue[500]}cc`,
      }}
    />
  );
};

export default WordPartialHighlight;
