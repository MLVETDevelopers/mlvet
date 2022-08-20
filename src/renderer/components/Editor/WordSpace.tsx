interface Props {
  isDropMarkerActive: boolean;
}

const WordSpace = ({ isDropMarkerActive }: Props) => {
  return (
    <span
      style={{
        background: isDropMarkerActive ? 'white' : 'none',
        transition: 'background 0.2s',
        width: '2px',
        paddingLeft: '1px',
        paddingRight: '1px',
      }}
    />
  );
};

export default WordSpace;
