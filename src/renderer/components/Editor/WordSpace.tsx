import colors from 'renderer/colors';
import { getColourForIndex } from 'renderer/utils/ui';

interface Props {
  isDropMarkerActive: boolean;
  isBetweenHighlightedWords: boolean;
  highlightedByClientWithIndex: number | null;
}

const WordSpace = ({
  isDropMarkerActive,
  isBetweenHighlightedWords,
  highlightedByClientWithIndex,
}: Props) => {
  const background: string = (() => {
    if (isDropMarkerActive) {
      return colors.yellow[500];
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
        width: `${isDropMarkerActive ? '2.4px' : '1px'}`,
        borderRadius: '1px',
      }}
    />
  );
};

export default WordSpace;
