import { Box, styled, Typography, Stack, Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import colors from 'renderer/colors';

const { getFileNameWithExtension } = window.electron;

const SelectMediaBox = styled(Box)`
  width: 100%;
`;

const InnerBox = styled(Box)`
  border-style: dashed;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${colors.grey[500]};
  color: ${colors.grey[300]};
  padding: 20px;

  &:hover {
    cursor: pointer;
    background: ${colors.grey[600]};
  }
`;

interface Props {
  setMediaFileName: Dispatch<SetStateAction<string | null>>;
  setMediaFilePath: Dispatch<SetStateAction<string | null>>;
  setIsAwaitingMedia: Dispatch<SetStateAction<boolean>>;
}

const SelectMediaBlock = ({
  setMediaFileName,
  setMediaFilePath,
  setIsAwaitingMedia,
}: Props) => {
  const selectMedia: () => Promise<void> = async () => {
    const selectedMedia = await window.electron.requestMediaDialog();

    if (selectMedia !== null) {
      setIsAwaitingMedia(false);
    }

    setMediaFilePath(selectedMedia);

    const fileName = await getFileNameWithExtension(selectedMedia);

    setMediaFileName(fileName);
  };

  return (
    <SelectMediaBox onClick={selectMedia}>
      <InnerBox>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: '150px' }}
        >
          <Typography variant="p-300">Drag and drop file here</Typography>
          <Typography variant="p-300">or</Typography>
          <Button color="primary">Browse</Button>
        </Stack>
      </InnerBox>
    </SelectMediaBox>
  );
};

export default SelectMediaBlock;
