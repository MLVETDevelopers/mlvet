import { styled, Box, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import colors from '../colors';

interface Props {
  fileName: string | null;
}

const CustomBox = styled(Box)`
  width: 100%;
  margin: 5px;
`;

const MediaDisplayOnUpload = ({ fileName }: Props) => {
  if (fileName === null) {
    return null;
  }

  return (
    <CustomBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <DoneIcon
            sx={{ color: colors.yellow[500], fontSize: 36, margin: '5px' }}
          />
          <Typography>{fileName}</Typography>
        </Stack>
        <DeleteIcon
          sx={{ color: colors.yellow[500], fontSize: 36, margin: '5px' }}
        />
      </Stack>
    </CustomBox>
  );
};

export default MediaDisplayOnUpload;
