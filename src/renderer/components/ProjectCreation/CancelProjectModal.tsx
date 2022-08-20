import { Modal, styled, Box, Button, Typography, Stack } from '@mui/material';
import colors from 'renderer/colors';

const CustomStack = styled(Stack)`
  width: 100%;
  height: 100%;
`;

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalInner = styled(Box)`
  background: ${colors.grey[700]};
  padding: 15px 30px 30px 30px;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 400px;
`;

const CustomRowStack = styled(CustomStack)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CustomButton = styled(Button)`
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.8));
  width: 100%;
`;

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  handleModalClose: () => void;
}

const CancelProjectModal = ({
  isOpen,
  closeDialog,
  handleModalClose,
}: Props) => {
  const continueProject = () => {
    closeDialog();
  };

  const cancelProject = () => {
    closeDialog();
    handleModalClose();
  };

  const cancelProjectButton = (
    <CustomButton color="primary" onClick={cancelProject}>
      Cancel Project
    </CustomButton>
  );

  const continueProjectButton = (
    <CustomButton color="secondary" onClick={continueProject}>
      Continue
    </CustomButton>
  );

  return (
    <div>
      <CustomModal open={isOpen} onClose={continueProject}>
        <CustomModalInner>
          <CustomStack>
            <Typography variant="h1" color={colors.grey[400]}>
              Cancel Project
            </Typography>
            <Typography variant="p-300" paddingTop="10px">
              Are you sure you want to cancel? Your progress will not be saved.
            </Typography>
            <CustomRowStack
              sx={{ paddingTop: '30px', alignItems: 'flex-end', gap: '32px' }}
            >
              {continueProjectButton}
              {cancelProjectButton}
            </CustomRowStack>
          </CustomStack>
        </CustomModalInner>
      </CustomModal>
    </div>
  );
};

export default CancelProjectModal;
