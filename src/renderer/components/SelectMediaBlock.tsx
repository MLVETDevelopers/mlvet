import { Box, styled, Typography, Stack, Button } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import colors from '../colors';
import ipc from '../ipc';

const { getFileNameWithExtension } = ipc;

const SelectMediaBox = styled(Box)`
  width: 100%;

  &:hover {
    background: ${colors.grey[600]};
  }
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
    const selectedMedia = await ipc.requestMediaDialog();
    if (selectMedia !== null) {
      setIsAwaitingMedia(false);
    }

    setMediaFilePath(selectedMedia);

    const fileName = await getFileNameWithExtension(selectedMedia);

    setMediaFileName(fileName);
  };

  // const [isDragOver, setDragOver] = useState<boolean>(false);

  // // const exitDragOver = () => setDragOver(false);
  // // const enterDragOver = () => setDragOver(true);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedFiles = e.dataTransfer.files;
    if (draggedFiles.length > 0) {
      /* Currently only supporting single file import */
      const fileName = draggedFiles[0].name;
      const filePath = draggedFiles[0].path;
      setMediaFilePath(filePath);
      setMediaFileName(fileName);
      setIsAwaitingMedia(false);
    }
  };

  return (
    <SelectMediaBox
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <InnerBox>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: '150px' }}
        >
          <Typography variant="p-300">Drag and drop file here</Typography>
          <Typography variant="p-300">or</Typography>
          <Button color="primary" onClick={selectMedia}>
            Browse
          </Button>
        </Stack>
      </InnerBox>
    </SelectMediaBox>
  );
};

export default SelectMediaBlock;
