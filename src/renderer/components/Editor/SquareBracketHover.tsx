import { Box } from '@mui/material';

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
        width: '8px',
        opacity: opacityValue,
        borderRadius: '8px',
        backgroundColor: '#FFB355',

        // positioning
        position: 'relative',
        left: '-5px',
        top: '-8px',

        '&:hover': {
          opacity: 0.5,
        },
      }}
    />
  );
};

const HorizontalBracketBackground = ({
  top,
  isHoveredOver,
  isLast,
}: HorizontalBracketProps) => {
  const bottomPixelOffset = isLast ? '14px' : '12px';
  const topBottomPosition = top
    ? { top: '-4px' }
    : { bottom: bottomPixelOffset };
  const idName = top ? 'topBracketBackground' : 'bottomBacketBackground';

  const opacityValue = isHoveredOver ? 0.5 : 0;
  return (
    <Box
      id={idName}
      sx={{
        height: '8px',
        width: '18px',
        opacity: opacityValue,
        borderRadius: '8px',
        backgroundColor: '#FFB355',

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
