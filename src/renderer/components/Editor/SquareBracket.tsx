import { styled } from '@mui/material';
import { Box } from '@mui/system';
import colors from 'renderer/colors';
import SquareBracketHover from './SquareBracketHover';

interface Props {
  isLast: boolean;
  isTakeGroupOpened: boolean;
}

const SquareBracket = ({ isLast, isTakeGroupOpened }: Props) => {
  const bottomWidth = isLast || !isTakeGroupOpened ? '2px' : '0px';

  const SquareBracketBox = styled(Box)({
    height: '60px',
    width: '15px',
    borderStyle: 'solid',
    borderColor: isTakeGroupOpened ? colors.yellow[500] : colors.grey[500],
    borderWidth: '0px',
    borderLeftWidth: '2px',
    borderTopWidth: '2px',
    borderBottomWidth: bottomWidth,

    '&:hover': {
      '.squareBracket': {
        opacity: 0.5,
      },
    },
  });

  return (
    <SquareBracketBox>
      <SquareBracketHover isLast={isLast} />
    </SquareBracketBox>
  );
};

export default SquareBracket;
