import styled from '@emotion/styled';
import { Box } from '@mui/system';

interface Props {
  isLast: boolean;
}

const SquareBracketBackground = styled(Box)({
  height: '100%',
  width: '16px',
  opacity: 0,

  '&:hover': {
    opacity: 0.5,
    backgroundColor: '#FFB355',
    borderRadius: '8px',
    borderWidth: '10px',
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
