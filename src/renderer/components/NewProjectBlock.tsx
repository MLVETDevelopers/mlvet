import { Box, colors, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import GenericSquareBox from './GenericSquareBox';
import ModalContainer from './NewProjectModal/ModalContainer';

const NewProjectBox = styled(Box)`
  background: ${colors.grey[900]};
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
    <NewProjectBox>
      <GenericSquareBox onClick={showModal}>
        <AddIcon fontSize="large" />
        <Typography fontWeight="bold">New Project or Drag Media</Typography>
      </GenericSquareBox>
      <ModalContainer isOpen={isShowingModal} closeModal={closeModal} />
    </NewProjectBox>
  );
};

export default NewProjectBlock;
