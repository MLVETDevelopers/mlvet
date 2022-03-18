import { Box, Card, colors, styled, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import NewProjectModal from "./NewProjectModal";
import { useState } from "react";

const NewProjectBox = styled(Box)`
  background: ${colors.grey[900]};
  width: calc(100vw - 80px);
  margin: 20px;
  padding: 80px 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewOrDragButton = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  
  background: ${colors.grey[400]};
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-right: 20px;
  color: ${colors.grey[900]};

  &:last {
    margin-right: 0;
  }

  &:hover {
    background: ${colors.grey[600]};
    cursor: pointer;
  }
`;

const NewProjectBlock = () => {
  const [isShowingModal, setShowingModal] = useState<boolean>(false);

  const closeModal = () => setShowingModal(false);
  const showModal = () => setShowingModal(true);

  return <NewProjectBox>
    <NewOrDragButton onClick={showModal}>
      <AddIcon fontSize="large" />
      <Typography fontWeight="bold">New Project or Drag Media</Typography>
    </NewOrDragButton>
    <NewProjectModal isOpen={isShowingModal} closeModal={closeModal} />
  </NewProjectBox>
};

export default NewProjectBlock;
