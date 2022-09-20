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
  width: 420px;
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
  closeModal: () => void;
  ungroupTakes: () => void;
}

const UngroupTakesModal = ({ isOpen, closeModal, ungroupTakes }: Props) => {
  const ungroupTakesButton = (
    <CustomButton color="primary" onClick={ungroupTakes}>
      Ungroup Takes
    </CustomButton>
  );

  const cancelButton = (
    <CustomButton color="secondary" onClick={closeModal}>
      Cancel
    </CustomButton>
  );

  return (
    <div>
      <CustomModal open={isOpen} onClose={closeModal}>
        <CustomModalInner>
          <CustomStack>
            <Typography variant="h1" color={colors.grey[400]}>
              Ungroup Takes
            </Typography>
            <Typography variant="p-300" paddingTop="10px">
              Are you sure you want to ungroup takes? This is not reversible.
            </Typography>
            <CustomRowStack
              sx={{ paddingTop: '30px', alignItems: 'flex-end', gap: '32px' }}
            >
              {cancelButton}
              {ungroupTakesButton}
            </CustomRowStack>
          </CustomStack>
        </CustomModalInner>
      </CustomModal>
    </div>
  );
};

export default UngroupTakesModal;
