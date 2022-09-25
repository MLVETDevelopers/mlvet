import colors from 'renderer/colors';

const EditMarkerSvg = (): JSX.Element => {
  return (
    <svg
      width="7"
      height="15"
      viewBox="0 0 5 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="2.5"
        y1="3"
        x2="2.5"
        y2="15"
        stroke={colors.yellow[500]}
        strokeDasharray="2 2"
        strokeWidth="2"
      />
      <path d="M 2.5 5 L -1 -1 L 6 -1 L 2.5 5 Z" fill={colors.yellow[500]} />
    </svg>
  );
};

export default EditMarkerSvg;
