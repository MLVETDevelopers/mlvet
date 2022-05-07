import {
  styled,
  Box,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
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

  const readyIcon = (
    <IconButton
      sx={{ color: colors.yellow[500], fontSize: 24, margin: '-6px' }}
    >
      <CachedIcon />
    </IconButton>
  );
  const loadingIcon = (
    <CircularProgress
      sx={{ color: colors.yellow[500], fontSize: 24, margin: '3px' }}
      size="23px"
      thickness={4}
    />
  );
  const doneIcon = (
    <IconButton
      sx={{ color: colors.yellow[500], fontSize: 24, margin: '-6px' }}
    >
      <DoneIcon />
    </IconButton>
  );
  const errorIcon = (
    <IconButton
      sx={{ color: colors.yellow[500], fontSize: 24, margin: '-6px' }}
    >
      <ErrorIcon />
    </IconButton>
  );

  const status = () => {
    switch (asyncState) {
      case AsyncState.READY:
        return readyIcon;
      case AsyncState.LOADING:
        return loadingIcon;
      case AsyncState.DONE:
        return doneIcon;
      case AsyncState.ERROR:
        return errorIcon;
      default:
        return errorIcon;
    }
  };

  return (
    <CustomBox>
      <Stack direction="row" alignItems="center" justifyContent="flex-start">
        <Stack marginLeft="5px" width="40px" height="30px">
          {status()}
        </Stack>
        <Typography
          overflow="hidden"
          textOverflow="ellipsis"
          marginLeft="15px"
          marginRight="40px"
          variant="p-400"
          sx={{ color: colors.grey[300] }}
        >
          {fileName}
        </Typography>
      </Stack>
    </CustomBox>
  );
};

export default MediaDisplayTranscribeProgress;
