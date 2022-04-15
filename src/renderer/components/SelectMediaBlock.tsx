import { Box, colors, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dispatch, SetStateAction } from 'react';
import requestMediaDialog from '../ipc';

const SelectMediaBox = styled(Box)`
  background: ${colors.grey[400]};
  color: ${colors.grey[900]};
  margin-top: 20px;
  padding: 20px;

  &:hover {
    cursor: pointer;
    background: ${colors.grey[600]};
  }
`;

const ImportFileBox = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: 80px 0;
`;

interface Props {
  mediaFileName: string | null;
  setMediaFileName: Dispatch<SetStateAction<string | null>>;
}

const SelectMediaBlock = ({ mediaFileName, setMediaFileName }: Props) => {
  const selectMedia: () => Promise<void> = async () => {
    const selectedMedia = await requestMediaDialog();
    setMediaFileName(selectedMedia);
  };

  return (
    <SelectMediaBox onClick={selectMedia}>
      <Typography fontWeight="bold">Video or Audio Base</Typography>
      {mediaFileName}
      <ImportFileBox>
        <AddIcon fontSize="large" />
        <Typography fontWeight="bold">Import File or Drag</Typography>
      </ImportFileBox>
    </SelectMediaBox>
  );
};

export default SelectMediaBlock;
