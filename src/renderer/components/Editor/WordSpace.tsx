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
        padding: 0,
        height: '24px',
        width: '2px',
        position: 'relative',
        margin: '2px 0',
      }}
    />
  );
};

export default WordSpace;
