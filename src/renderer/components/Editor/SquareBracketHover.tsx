import { Box } from '@mui/material';
import colors from 'renderer/colors';

interface BracketProps {
  isHoveredOver: boolean;
}

interface Props extends BracketProps {
  isLast: boolean;
}

interface HorizontalBracketProps extends BracketProps, Props {
  top: boolean;
}

const VerticalBracketBackground = ({ isHoveredOver }: BracketProps) => {
  const opacityValue = isHoveredOver ? 0.5 : 0;

  return (
    <Box
      id="squareBracketBackground"
      sx={{
        height: 'inherit',
        width: '6px',
        opacity: opacityValue,
        borderRadius: '8px',
        backgroundColor: colors.yellow[500],

        // positioning
        position: 'relative',
        left: '-4px',
        top: '-7px',
      }}
    />
  );
};

const HorizontalBracketBackground = ({
  top,
  isHoveredOver,
  isLast,
}: HorizontalBracketProps) => {
  const bottomPixelOffset = isLast ? '12px' : '10px';
  const topBottomPosition = top
    ? { top: '-4px' }
    : { bottom: bottomPixelOffset };
  const idName = top ? 'topBracketBackground' : 'bottomBacketBackground';

  const opacityValue = isHoveredOver ? 0.5 : 0;
  return (
    <Box
      id={idName}
      sx={{
        height: '6px',
        width: '13px',
        opacity: opacityValue,
        borderRadius: '8px',
        backgroundColor: colors.yellow[500],

        // positioning
        position: 'relative',
        left: '-4px',
        ...topBottomPosition,
      }}
    />
  );
};

const SquareBracketHover = ({ isLast, isHoveredOver }: Props) => {
  return (
    <>
      <HorizontalBracketBackground
        top
        isHoveredOver={isHoveredOver}
        isLast={isLast}
      />
      <VerticalBracketBackground isHoveredOver={isHoveredOver} />
      <HorizontalBracketBackground
        top={false}
        isHoveredOver={isHoveredOver}
        isLast={isLast}
      />
    </>
  );
};

export default SquareBracketHover;
