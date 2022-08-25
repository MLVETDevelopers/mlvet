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
      return 'white';
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
        width: '2px',
        height: '24px',
        padding: '0 1px',
      }}
    />
  );
};

export default WordSpace;
