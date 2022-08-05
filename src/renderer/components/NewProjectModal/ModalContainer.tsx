import {
  Modal,
  styled,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
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

const CustomDialog = styled(Dialog)`
  background: ${colors.grey[700]};
`;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalContainer = ({ isOpen, closeModal }: Props) => {
  const [currentView, setCurrentView] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);

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
    setOpenDialog(false);
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

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const runOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <div>
      <CustomModal open={isOpen} onClose={runOpenDialog}>
        <CustomModalInner sx={{ width: { xs: 300, sm: 400, lg: 500 } }}>
          {view}
        </CustomModalInner>
      </CustomModal>
      <CustomDialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cancel new project</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Yes</Button>
          <Button onClick={handleDialogClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default ModalContainer;
