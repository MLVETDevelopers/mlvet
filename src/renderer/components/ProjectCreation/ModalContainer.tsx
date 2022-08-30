import { Modal, styled, Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { pageChanged } from '../../store/currentPage/actions';
import { ApplicationPage } from '../../store/currentPage/helpers';
import NewProjectView from './NewProjectView';
import CloudConfigView from './CloudConfigView';
import RunTranscriptionView from './RunTranscriptionView';
import ImportMediaView from './ImportMediaView';
import colors from '../../colors';
import CancelProjectModal from './CancelProjectModal';
import ipc from '../../ipc';

const { requireCloudConfig } = ipc;

const CustomModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CustomModalInner = styled(Box)({
  background: colors.grey[700],
  padding: '15px 30px 30px 30px',
  borderRadius: '5px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
});

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalContainer = ({ isOpen, closeModal }: Props) => {
  const [currentView, setCurrentView] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const [isCloudConfigRequired, setIsCloudConfigRequired] = useState(false);

  const dispatch = useDispatch();

  const navigate: (applicationPage: ApplicationPage) => void = useCallback(
    (applicationPage: ApplicationPage) =>
      dispatch(pageChanged(applicationPage)),
    [dispatch]
  );

  const handleModalClose: () => void = () => {
    closeModal();
    setCurrentView(0);
    setProjectName('');
  };

  const [showingCancelProject, setShowingCancelProject] = useState(false);

  const closeCancelProject = () => setShowingCancelProject(false);

  const showCancelProject = () => {
    if (projectName.length > 0) {
      setShowingCancelProject(true);
    } else {
      handleModalClose();
    }
  };

  const viewComponents: any = useMemo(() => {
    if (isCloudConfigRequired) {
      return [
        NewProjectView,
        CloudConfigView,
        ImportMediaView,
        RunTranscriptionView,
      ];
    }
    return [NewProjectView, ImportMediaView, RunTranscriptionView];
  }, [isCloudConfigRequired]);

  useEffect(() => {
    const fetchIfCloudConfigRequired = async () => {
      const isConfigRequired = await requireCloudConfig();
      setIsCloudConfigRequired(isConfigRequired);
    };

    fetchIfCloudConfigRequired().catch(console.log);
  }, [setIsCloudConfigRequired]);

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
          <NewProjectView
            closeModal={showCancelProject}
            nextView={nextView}
            projectName={projectName}
            setProjectName={setProjectName}
          />
        );
      case CloudConfigView:
        return (
          <CloudConfigView
            prevView={prevView}
            closeModal={showCancelProject}
            nextView={nextView}
            projectName={projectName}
            textToDisplay={null}
          />
        );
      case ImportMediaView:
        return (
          <ImportMediaView
            prevView={prevView}
            closeModal={showCancelProject}
            nextView={nextView}
          />
        );
      case RunTranscriptionView:
        return (
          <RunTranscriptionView
            closeModal={showCancelProject}
            nextView={nextView}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div>
      <CustomModal open={isOpen} onClose={showCancelProject}>
        <CustomModalInner sx={{ width: { xs: 300, sm: 400, lg: 500 } }}>
          {view}
        </CustomModalInner>
      </CustomModal>
      <CancelProjectModal
        isOpen={showingCancelProject}
        closeDialog={closeCancelProject}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default ModalContainer;
