import { Stack, styled, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProgressBar from './ProgressBar';
import colors from '../colors';

const Card = styled(Stack)({
  width: '232px',
  height: '68px',
  padding: '12px 16px',
  gap: '6px',
  backgroundColor: colors.grey[600],
  borderRadius: '5px',
  position: 'relative',
});

interface Props {
  onClose: () => void;
  progress: number;
}

const ExportCard = ({ onClose, progress }: Props) => {
  const exportText = progress === 1 ? 'Export Complete' : 'Exporting...';
  const closeButton =
    progress === 1 ? (
      <IconButton
        sx={{
          color: colors.grey[500],
          marginLeft: 'auto',
          position: 'absolute',
          right: '0px',
          top: '0px',
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    ) : null;

  return (
    <Card>
      <Typography variant="h3" color="primary.main">
        {exportText}
      </Typography>
      {closeButton}
      <ProgressBar variant="determinate" value={progress * 100} />
    </Card>
  );
};

export default ExportCard;
