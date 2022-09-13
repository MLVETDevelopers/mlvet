import styled from '@emotion/styled';
import { Box } from '@mui/system';

interface Props {
  isLast: boolean;
}

const SquareBracketBackground = styled(Box)({
  height: 'inherit',
  width: '8px',
  opacity: 0,
  borderRadius: '8px',
  backgroundColor: '#FFB355',

  // positioning
  position: 'absolute',
  left: '17px',

  '&:hover': {
    opacity: 0.5,
  },
});

const SquareBracket = ({ isLast }: Props) => {
  const bottomWidth = isLast ? '2px' : '0px';
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
    >
      <SquareBracketBackground id="squareBracketBackground" />
    </Box>
  );
};

export default SquareBracket;
