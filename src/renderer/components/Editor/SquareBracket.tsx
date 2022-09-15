import { styled } from '@mui/material';
import { Box } from '@mui/system';
import colors from 'renderer/colors';
import SquareBracketHover from './SquareBracketHover';

interface Props {
  isLast: boolean;
  isTakeGroupOpened: boolean;
  takeIndex: number;
  takeGroupId: number;
}

const SquareBracket = ({
  isLast,
  isTakeGroupOpened,
  takeIndex,
  takeGroupId,
}: Props) => {
  const bottomWidth = isLast || !isTakeGroupOpened ? '2px' : '0px';

  const componentClassName = ['squareBracket', takeGroupId, takeIndex].join(
    '-'
  );
  const componentSelector = '&:.'.concat('', componentClassName);

  const hoverCss = { '&:hover': { [componentSelector]: { opacity: 0.5 } } };

  console.log(hoverCss);

  const SquareBracketBox = styled(Box)({
    height: '60px',
    width: '15px',
    borderStyle: 'solid',
    borderColor: isTakeGroupOpened ? colors.yellow[500] : colors.grey[500],
    borderWidth: '0px',
    borderLeftWidth: '2px',
    borderTopWidth: '2px',
    borderBottomWidth: bottomWidth,

    ...hoverCss,
  });

  return (
    <SquareBracketBox>
      <SquareBracketHover isLast={isLast} compClassName={componentClassName} />
    </SquareBracketBox>
  );
};

export default SquareBracket;
