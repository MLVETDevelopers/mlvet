import { Box, Typography, Stack, styled, Modal } from '@mui/material';
import { useState } from 'react';
import colors from 'renderer/colors';
import {
  PrimaryButton,
  SecondaryButton,
} from 'renderer/components/Blocks/Buttons';
import ipc from 'renderer/ipc';
import { URL_USER_FEEDBACK_FORM } from '../../../constants';
import ReportBugModal from './ReportBugModal';

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

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProvideFeedbackModal = ({ open, onClose }: Props) => {
  const [isBugReportOpen, setBugReportOpen] = useState(false);

  const openReportBugDialog = () => {
    onClose();
    setBugReportOpen(true);
  };

  const openFeedbackLink = () => {
    ipc.openExternalLink(URL_USER_FEEDBACK_FORM);
    onClose();
  };

  return (
    <div>
      <ReportBugModal
        open={isBugReportOpen}
        onClose={() => setBugReportOpen(false)}
      />
      <CustomModal open={open} onClose={onClose}>
        <CustomModalInner>
          <CustomStack paddingTop="10px">
            <Typography variant="h1" color={colors.grey[400]}>
              Provide User Feedback
            </Typography>
            <Typography variant="p-300" paddingTop="10px">
              Would you like to report a bug or provide general feedback for
              MLVET?
            </Typography>
            <CustomRowStack
              sx={{ paddingTop: '30px', alignItems: 'flex-end', gap: '32px' }}
            >
              <SecondaryButton onClick={onClose}>Close</SecondaryButton>
              <PrimaryButton
                onClick={openReportBugDialog}
                sx={{ left: '30px' }}
              >
                Bug
              </PrimaryButton>
              <PrimaryButton onClick={openFeedbackLink}>Feedback</PrimaryButton>
            </CustomRowStack>
          </CustomStack>
        </CustomModalInner>
      </CustomModal>
    </div>
  );
};

export default ProvideFeedbackModal;
