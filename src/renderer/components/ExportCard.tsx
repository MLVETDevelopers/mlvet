import { Stack, styled, Typography } from '@mui/material';
import ProgressBar from './ProgressBar';
import colors from '../colors';

const Card = styled(Stack)`
  width: 232px;
  height: 68px;
  padding: 12px 16px;
  gap: 6px;
  background-color: ${colors.grey[600]};
  border-radius: 5px;
`;

interface Props {
  progress: number;
}

const ExportCard = ({ progress }: Props) => {
  return (
    <Card>
      <Typography variant="body1" color="primary.main">
        Exporting...
      </Typography>
      <ProgressBar variant="determinate" value={progress * 100} />
    </Card>
  );
};

export default ExportCard;
