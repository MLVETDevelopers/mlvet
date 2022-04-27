import { Stack, Typography } from '@mui/material';
import ProgressBar from './ProgressBar';
import colors from '../colors';

interface Props {
  progress: number;
}

const ExportCard = ({ progress }: Props) => {
  return (
    <Stack
      sx={{
        width: '232px',
        height: '68px',
        py: '12px',
        px: '16px',
        gap: '6px',
        backgroundColor: colors.grey[600],
        borderRadius: '5px',
      }}
    >
      <Typography variant="h-300" color="primary.main">
        Exporting...
      </Typography>
      <ProgressBar variant="determinate" value={progress * 100} />
    </Stack>
  );
};

export default ExportCard;
