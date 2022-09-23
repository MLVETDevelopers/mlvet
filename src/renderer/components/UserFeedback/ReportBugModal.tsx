import {
  Box,
  Typography,
  Stack,
  styled,
  Modal,
  TextField,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import colors from 'renderer/colors';
import {
  PrimaryButton,
  SecondaryButton,
} from 'renderer/components/Blocks/Buttons';
import ipc from '../../ipc';

const STATUS_OK = 200;

const { reportBug } = ipc;

const CustomStack = styled(Stack)`
  width: 100%;
  height: 100%;
  justify-content: space-between;
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

interface Props {
  open: boolean;
  onClose: () => void;
}

const ReportBugModal = ({ open, onClose }: Props) => {
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMesasge, setSnackbarMessage] = useState('');

  const handleBugTitleInput = (value: string) => {
    setBugTitle(value);
  };

  const handleBugDescInput = (value: string) => {
    setBugDescription(value);
  };

  const onCloseBugModal = () => {
    setBugTitle('');
    setBugDescription('');
    onClose();
  };

  const onSubmit = async () => {
    const status = await reportBug(bugTitle, bugDescription);

    setSnackbarMessage(
      status === STATUS_OK
        ? 'Your bug report has been submitted!'
        : 'An error has occurred, please try again later.'
    );

    setBugTitle('');
    setBugDescription('');
    onClose();
    setShowSnackbar(true);
  };

  return (
    <div>
      <CustomModal open={open} onClose={onCloseBugModal}>
        <CustomModalInner>
          <CustomStack paddingTop="10px" paddingBottom="10px">
            <Typography variant="h1" color={colors.grey[400]}>
              Report a bug
            </Typography>
            <CustomStack>
              <TextField
                sx={{ marginBottom: '10px', input: { color: '#FAFBFC' } }}
                label="Bug Title"
                variant="outlined"
                value={bugTitle}
                onChange={(event) => handleBugTitleInput(event.target.value)}
                autoFocus
                size="small"
              />
              <TextField
                inputProps={{ style: { color: '#FAFBFC' } }}
                label="Bug description"
                variant="outlined"
                value={bugDescription}
                onChange={(event) => handleBugDescInput(event.target.value)}
                multiline
                rows={3}
              />
            </CustomStack>
            <CustomRowStack
              sx={{ paddingTop: '30px', alignItems: 'flex-end', gap: '32px' }}
            >
              <SecondaryButton onClick={onCloseBugModal}>Close</SecondaryButton>
              <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
            </CustomRowStack>
          </CustomStack>
        </CustomModalInner>
      </CustomModal>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMesasge}
      />
    </div>
  );
};

export default ReportBugModal;
