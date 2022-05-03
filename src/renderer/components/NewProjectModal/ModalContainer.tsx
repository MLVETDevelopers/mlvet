import { Modal, styled, colors, Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { pageChanged } from '../../store/actions';
import { ApplicationPage } from '../../store/helpers';
import NewProjectView from './NewProjectView';
import RunTranscriptionView from './RunTranscriptionView';
import UploadVideoView from './UploadVideoView';

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

  const dispatch = useDispatch();

  const navigate: (applicationPage: ApplicationPage) => void = useCallback(
    (applicationPage: ApplicationPage) =>
      dispatch(pageChanged(applicationPage)),
    [dispatch]
  );

  const viewComponents = [
    NewProjectView,
    UploadVideoView,
    RunTranscriptionView,
  ];

  const nextView: () => void = () => {
    if (currentView >= viewComponents.length - 1) {
      closeModal();
      navigate(ApplicationPage.PROJECT);
      return;
    }
    setCurrentView((prev) => prev + 1);
  };

  const view = (() => {
    const viewComponent = viewComponents[currentView];
    switch (viewComponent) {
      case NewProjectView:
        return <NewProjectView closeModal={closeModal} nextView={nextView} />;
      case UploadVideoView:
        return <UploadVideoView closeModal={closeModal} nextView={nextView} />;
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
