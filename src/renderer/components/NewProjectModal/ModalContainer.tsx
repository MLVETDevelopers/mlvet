import { Modal, styled, Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { pageChanged } from '../../store/currentPage/actions';
import { ApplicationPage } from '../../store/currentPage/helpers';
import NewProjectView from './NewProjectView';
import RunTranscriptionView from './RunTranscriptionView';
import ImportMediaView from './ImportMediaView';
import colors from '../../colors';

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
    ImportMediaView,
    RunTranscriptionView,
  ];

  const handleModalClose: () => void = () => {
    closeModal();
    setCurrentView(0);
  };

  const nextView: () => void = () => {
    if (currentView >= viewComponents.length - 1) {
      handleModalClose();
      navigate(ApplicationPage.PROJECT);
      return;
    }
    setCurrentView((prev) => prev + 1);
  };

  const prevView: () => void = () => {
    if (currentView === 0) {
      handleModalClose();
      return;
    }
    setCurrentView((prev) => prev - 1);
  };

  const view = (() => {
    const viewComponent = viewComponents[currentView];
    switch (viewComponent) {
      case NewProjectView:
        return (
          <NewProjectView closeModal={handleModalClose} nextView={nextView} />
        );
      case ImportMediaView:
        return (
          <ImportMediaView
            prevView={prevView}
            closeModal={handleModalClose}
            nextView={nextView}
          />
        );
      case RunTranscriptionView:
        return (
          <RunTranscriptionView
            closeModal={handleModalClose}
            nextView={nextView}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <CustomModal open={isOpen} onClose={handleModalClose}>
      <CustomModalInner sx={{ width: { xs: 300, sm: 400, lg: 500 } }}>
        {view}
      </CustomModalInner>
    </CustomModal>
  );
};

export default ModalContainer;
