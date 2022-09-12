import { Box } from '@mui/system';

interface Props {
  isLast: boolean;
}

const SquareBracket = ({ isLast }: Props) => {
  const bottomWidth = isLast ? '2px' : '0px';
  return (
    <Box
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
    />
  );
};

export default SquareBracket;
