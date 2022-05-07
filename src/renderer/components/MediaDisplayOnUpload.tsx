import { styled, Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import colors from '../colors';

interface Props {
  fileName: string | null;
}

const CustomBox = styled(Box)`
  width: 100%;
`;

const MediaDisplayOnUpload = ({ fileName }: Props) => {
  if (fileName === null) {
    return null;
  }

  return (
    <CustomBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <IconButton
            sx={{ color: colors.yellow[500], fontSize: 24, margin: '5px' }}
          >
            <DoneIcon />
          </IconButton>

          <Typography variant="p-400" sx={{ color: colors.grey[300] }}>
            {fileName}
          </Typography>
        </Stack>
        <IconButton
          sx={{ color: colors.yellow[500], fontSize: 24, margin: '5px' }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </CustomBox>
  );
};

export default MediaDisplayOnUpload;
