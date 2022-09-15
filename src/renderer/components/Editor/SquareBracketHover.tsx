import { Box } from '@mui/material';
import colors from 'renderer/colors';

interface Props {
  isLast: boolean;
  compClassName: string;
}

interface VerticleBracketProps {
  compClassName: string;
}
interface HorizontalBracketProps extends Props {
  top: boolean;
}

const VerticalBracketBackground = ({ compClassName }: VerticleBracketProps) => {
  return (
    <Box
      className={compClassName}
      sx={{
        height: 'inherit',
        width: '8px',
        opacity: 0,
        borderRadius: '8px',
        backgroundColor: colors.yellow[500],

        // positioning
        position: 'relative',
        left: '-5px',
        top: '-8px',
      }}
    />
  );
};

const HorizontalBracketBackground = ({
  top,
  isLast,
  compClassName,
}: HorizontalBracketProps) => {
  const bottomPixelOffset = isLast ? '14px' : '12px';
  const topBottomPosition = top
    ? { top: '-4px' }
    : { bottom: bottomPixelOffset };
  const idName = top ? 'topBracketBackground' : 'bottomBacketBackground';

  return (
    <Box
      className={compClassName}
      id={idName}
      sx={{
        height: '8px',
        width: '18px',
        opacity: 0,
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

const SquareBracketHover = ({ isLast, compClassName }: Props) => {
  return (
    <>
      <HorizontalBracketBackground
        top
        isLast={isLast}
        compClassName={compClassName}
      />
      <VerticalBracketBackground compClassName={compClassName} />
      <HorizontalBracketBackground
        top={false}
        isLast={isLast}
        compClassName={compClassName}
      />
    </>
  );
};

export default SquareBracketHover;
