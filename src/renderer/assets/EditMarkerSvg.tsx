const EditMarkerSvg = (): JSX.Element => {
  return (
    <svg
      width="5"
      height="15"
      viewBox="0 0 5 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: 'translateY(-7px)',
      }}
    >
      <line
        x1="2.5"
        y1="3"
        x2="2.5"
        y2="15"
        stroke="#FAFBFC"
        strokeDasharray="2 2"
      />
      <path d="M2.5 5L0.334936 1.25L4.66506 1.25L2.5 5Z" fill="#FAFBFC" />
      <path d="M2.5 5L0.334936 1.25L4.66506 1.25L2.5 5Z" fill="#FAFBFC" />
    </svg>
  );
};

export default EditMarkerSvg;
