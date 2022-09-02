import colors from 'renderer/colors';

interface Props {
  isDropMarkerActive: boolean;
  isBetweenHighlightedWords: boolean;
}

const WordSpace = ({
  isDropMarkerActive,
  isBetweenHighlightedWords,
}: Props) => {
  const background: string = (() => {
    if (isDropMarkerActive) {
      return colors.yellow[500];
    }
    if (isBetweenHighlightedWords) {
      return `${colors.blue[500]}cc`;
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
