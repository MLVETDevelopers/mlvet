import { Box } from '@mui/system';
import { useState } from 'react';
import colors from 'renderer/colors';
import SquareBracketHover from './SquareBracketHover';

interface Props {
  isLast: boolean;
  isTakeGroupOpened: boolean;
  takeHeight: number;
}

const SquareBracket = ({ isLast, isTakeGroupOpened, takeHeight }: Props) => {
  const bottomWidth = isLast || !isTakeGroupOpened ? '2px' : '0px';

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Box
      id="squareBracket"
      sx={{
        height: takeHeight + 15,
        width: '8px',
        borderStyle: 'solid',
        borderColor: isTakeGroupOpened ? colors.yellow[500] : colors.grey[500],
        borderWidth: '0px',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        borderBottomWidth: bottomWidth,
      }}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <SquareBracketHover isLast={isLast} isHoveredOver={isHovering} />
    </Box>
  );
};

export default SquareBracket;
