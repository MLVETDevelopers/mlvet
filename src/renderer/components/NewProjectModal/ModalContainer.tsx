import { Modal, styled, colors, Box } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router';
import ImportMediaView from './ImportMediaView';
import RunTranscriptionView from './RunTranscriptionView';

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalInner = styled(Box)`
  width: calc(80vw - 40px);
  background: ${colors.grey[900]};
  padding: 20px;
`;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalContainer = ({ isOpen, closeModal }: Props) => {
  const [currentView, setCurrentView] = useState<number>(0);

  const history = useHistory();

  const viewComponents = [ImportMediaView, RunTranscriptionView];

  const nextView: () => void = () => {
    if (currentView >= viewComponents.length - 1) {
      closeModal();
      history.push('/project');
      return;
    }
    setCurrentView((prev) => prev + 1);
  };

  const view = (() => {
    const viewComponent = viewComponents[currentView];
    switch (viewComponent) {
      case ImportMediaView:
        return <ImportMediaView closeModal={closeModal} nextView={nextView} />;
      case RunTranscriptionView:
        return (
          <RunTranscriptionView closeModal={closeModal} nextView={nextView} />
        );
      default:
        return null;
    }
  })();

  return (
    <CustomModal open={isOpen} onClose={closeModal}>
      <CustomModalInner>{view}</CustomModalInner>
    </CustomModal>
  );
};

export default ModalContainer;
