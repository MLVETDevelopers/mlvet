import React from 'react';
import colors from 'renderer/colors';
import { getColourForIndex } from 'renderer/utils/ui';

interface Props {
  isBetweenHighlightedWords: boolean;
  isBetweenCtrlFHighlightedWords: boolean;
  isCtrlFSelectedIndex: boolean;
  highlightedByClientWithIndex: number | null;
}

const WordSpace = ({
  isBetweenHighlightedWords,
  isBetweenCtrlFHighlightedWords,
  isCtrlFSelectedIndex,
  highlightedByClientWithIndex,
}: Props) => {
  const background: string = (() => {
    if (isBetweenCtrlFHighlightedWords) {
      if (isCtrlFSelectedIndex) {
        return `${colors.blue[500]}cc`;
      }
      return `${colors.yellow[400]}cc`;
    }
    if (isBetweenHighlightedWords) {
      return `${colors.blue[500]}cc`;
    }
    if (highlightedByClientWithIndex !== null) {
      return `${getColourForIndex(highlightedByClientWithIndex)}cc`;
    }
    return 'none';
  })();

  return (
    <div
      style={{
        display: 'inline-block',
        background,
        height: '24px',
        width: '1px',
        borderRadius: '1px',
      }}
    />
  );
};

export default React.memo(WordSpace);
