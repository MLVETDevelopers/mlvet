import { Box, Stack, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import GenericSquareBox from './GenericSquareBox';
import ModalContainer from './NewProjectModal/ModalContainer';
import colors from '../colors';

const NewProjectBox = styled(Box)`
  background: ${colors.grey[700]};
  width: calc(100vw - 80px);
  margin: 20px;
  padding: 80px 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewProjectBlock = () => {
  const [isShowingModal, setShowingModal] = useState<boolean>(false);

  const closeModal = () => setShowingModal(false);
  const showModal = () => setShowingModal(true);

  return (
    <NewProjectBox onClick={showModal}>
      <Stack alignItems="center">
        <AddIcon sx={{ color: colors.yellow[500], fontSize: 72 }} />
        <Typography fontWeight="bold">New project</Typography>
      </Stack>
      <ModalContainer isOpen={isShowingModal} closeModal={closeModal} />
    </NewProjectBox>
  );
};

export default NewProjectBlock;
