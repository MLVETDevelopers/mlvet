import { Stack, styled, Typography } from '@mui/material';
import ProgressBar from './ProgressBar';
import colors from '../colors';

const Card = styled(Stack)({
  width: '232px',
  height: '68px',
  padding: '12px 16px',
  gap: '6px',
  backgroundColor: colors.grey[600],
  borderRadius: '5px',
});

interface Props {
  progress: number;
}

const ExportCard = ({ progress }: Props) => {
  return (
    <Card>
      <Typography variant="h3" color="primary.main">
        Exporting...
      </Typography>
      <ProgressBar variant="determinate" value={progress * 100} />
    </Card>
  );
};

export default ExportCard;
