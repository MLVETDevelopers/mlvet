import { styled, Box, Stack } from '@mui/material';
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
  const view = (() => {
    if (fileName === null) {
      return null;
    }

    return (
      <CustomBox>
        <Stack>
          <DoneIcon sx={{ color: colors.yellow[500], fontSize: 36 }} />
          {fileName}
          <DeleteIcon sx={{ color: colors.yellow[500], fontSize: 36 }} />
        </Stack>
      </CustomBox>
    );
  })();

  return { view };
};

export default MediaDisplayOnUpload;
