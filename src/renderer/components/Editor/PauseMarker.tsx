import { Box } from '@mui/material';
import colors from 'renderer/colors';
import PauseMarkerSvg from '../../assets/PauseMarkerSvg';

interface Props {
  duration: number;
  isHighlighted: boolean;
}

const PauseMarker = ({ duration, isHighlighted }: Props) => {
  const durationDisplay = (
    <Box
      sx={{
        color: isHighlighted ? colors.white : colors.grey[500],
        position: 'absolute',
        top: 2,
        fontSize: 8,
      }}
    >
      {duration.toFixed(1)}s
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', top: 5, height: 24 }}>
      {durationDisplay}
      <PauseMarkerSvg />
    </Box>
  );
};

export default PauseMarker;
