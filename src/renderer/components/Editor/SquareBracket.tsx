import { Box } from '@mui/system';
import { useState } from 'react';
import SquareBracketHover from './SquareBracketHover';

interface Props {
  isLast: boolean;
}

const SquareBracket = ({ isLast }: Props) => {
  const bottomWidth = isLast ? '2px' : '0px';

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <Box
      id="squareBracket"
      sx={{
        height: '60px',
        width: '15px',
        borderStyle: 'solid',
        borderColor: '#FFB355',
        borderWidth: '0px',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        borderBottomWidth: bottomWidth,
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <SquareBracketHover isLast={isLast} isHoveredOver={isHovering} />
    </Box>
  );
};

export default SquareBracket;
