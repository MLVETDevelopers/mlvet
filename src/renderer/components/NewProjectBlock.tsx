import { Box, Paper, Stack, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import ModalContainer from './NewProjectModal/ModalContainer';
import colors from '../colors';

const NewProjectBox = styled(Paper)`
  background: ${colors.grey[700]};
  width: calc(100% - 40px);
  margin: 20px;
  margin-top: 0;
  padding: 80px 20px;
  height: 25vh;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${colors.grey[300]};
`;

const NewProjectBoxWrapper = styled(Box)`
  padding: 40px;
`;

const NewProjectBlock = () => {
  const [isShowingModal, setShowingModal] = useState<boolean>(false);

  const closeModal = () => setShowingModal(false);
  const showModal = () => setShowingModal(true);

  return (
    <NewProjectBoxWrapper>
      <NewProjectBox onClick={showModal} elevation={3}>
        <Stack alignItems="center">
          <AddIcon sx={{ color: colors.yellow[500], fontSize: 72 }} />
          <Typography>New project</Typography>
        </Stack>
      </NewProjectBox>
      <ModalContainer isOpen={isShowingModal} closeModal={closeModal} />
    </NewProjectBoxWrapper>
  );
};

export default NewProjectBlock;
