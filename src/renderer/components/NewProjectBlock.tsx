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

  transition: 0.5s background;

  .MuiStack-root {
    transition: 0.5s transform;
  }

  &:hover {
    background: ${colors.grey[600]};
    cursor: pointer;

    .MuiStack-root {
      transform: scale(1.05);
    }
  }
`;

const NewProjectBoxWrapper = styled(Box)`
  padding: 40px;
`;

const FullSizeNewProjectBox = styled(NewProjectBox)`
  height: calc(100vh - 80px);
`;

interface Props {
  isFullSize: boolean;
}

const NewProjectBlock = ({ isFullSize }: Props) => {
  const [isShowingModal, setShowingModal] = useState<boolean>(false);

  const closeModal = () => setShowingModal(false);
  const showModal = () => setShowingModal(true);

  const BoxComponent = isFullSize ? FullSizeNewProjectBox : NewProjectBox;

  return (
    <NewProjectBoxWrapper>
      <BoxComponent onClick={showModal} elevation={3}>
        <Stack alignItems="center" className="MuiStack-root">
          <AddIcon sx={{ color: colors.yellow[500], fontSize: 72 }} />
          <Typography>New Project</Typography>
        </Stack>
      </BoxComponent>
      <ModalContainer isOpen={isShowingModal} closeModal={closeModal} />
    </NewProjectBoxWrapper>
  );
};

export default NewProjectBlock;
