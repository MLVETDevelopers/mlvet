import {
  styled,
  Box,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import colors from '../colors';

enum AsyncState {
  READY = 'READY',
  LOADING = 'LOADING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

interface Props {
  fileName: string | null;
  asyncState: AsyncState;
}

const CustomBox = styled(Box)`
  width: 100%;
  margin-top: 5px;
`;

const MediaDisplayTranscribeProgress = ({ fileName, asyncState }: Props) => {
  if (fileName === null) {
    return null;
  }

  const done = (
    <IconButton sx={{ color: colors.yellow[500], fontSize: 24, margin: '5px' }}>
      <DoneIcon />
    </IconButton>
  );

  const loading = <CircularProgress />;

  return (
    <CustomBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {asyncState === AsyncState.READY ? loading : done}
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Typography variant="p-400" sx={{ color: colors.grey[300] }}>
            {fileName}
          </Typography>
        </Stack>
      </Stack>
    </CustomBox>
  );
};

export default MediaDisplayTranscribeProgress;
