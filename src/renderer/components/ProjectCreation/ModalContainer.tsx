import { Modal, styled, Box } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TranscriptionEngine } from 'sharedTypes';
import { pageChanged } from '../../store/currentPage/actions';
import { ApplicationPage } from '../../store/currentPage/helpers';
import NewProjectView from './NewProjectView';
import CloudConfigView from './CloudConfigView';
import RunTranscriptionView from './RunTranscriptionView';
import ImportMediaView from './ImportMediaView';
import colors from '../../colors';
import CancelProjectModal from './CancelProjectModal';
import ipc from '../../ipc';
import TranscriptionChoiceView from './TranscriptionChoiceView';
import LocalConfigView from './LocalConfigViews/LocalConfigView';

const { areEngineConfigRequirementsMet, getTranscriptionEngine } = ipc;

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

const views = {
  newProject: 'newProject',
  transcriptionChoice: 'transcriptionChoice',
  localConfig: 'localConfig',
  cloudConfig: 'cloudConfig',
  importMedia: 'importMedia',
  runTranscription: 'runTranscription',
};

const ModalContainer = ({ isOpen, closeModal }: Props) => {
  const [currentView, setCurrentView] = useState<string>(views.newProject);
  const [projectName, setProjectName] = useState<string>('');

  const dispatch = useDispatch();

  const navigate: (applicationPage: ApplicationPage) => void = useCallback(
    (applicationPage: ApplicationPage) =>
      dispatch(pageChanged(applicationPage)),
    [dispatch]
  );

  const handleModalClose: () => void = () => {
    closeModal();
    setCurrentView(views.newProject);
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

  const viewComponents = useMemo(() => {
    return {
      [views.newProject]: NewProjectView,
      [views.transcriptionChoice]: TranscriptionChoiceView,
      [views.localConfig]: LocalConfigView,
      [views.cloudConfig]: CloudConfigView,
      [views.importMedia]: ImportMediaView,
      [views.runTranscription]: RunTranscriptionView,
    };
  }, []);

  const goToTranscriptionEngineConfigView = async () => {
    // Checks if user has already configured the default transcription engine
    const areConfigRequirementsMet = await areEngineConfigRequirementsMet();
    if (areConfigRequirementsMet) {
      setCurrentView(views.importMedia);
      return;
    }

    const engine = await getTranscriptionEngine();
    switch (engine) {
      case TranscriptionEngine.VOSK:
        setCurrentView(views.localConfig);
        return;
      case TranscriptionEngine.ASSEMBLYAI:
        setCurrentView(views.cloudConfig);
        return;
      default:
        setCurrentView(views.importMedia);
    }
  };

  const goToTranscriptionChoiceView = async () => {
    // Checks if the user has chosen a transcription engine before
    const engine = await getTranscriptionEngine();
    if (engine !== null) goToTranscriptionEngineConfigView();
    else setCurrentView(views.transcriptionChoice);
  };

  const completeProjectCreation: () => void = () => {
    handleModalClose();
    navigate(ApplicationPage.PROJECT);
  };

  const view = (() => {
    const viewComponent = viewComponents[currentView];
    switch (viewComponent) {
      case NewProjectView:
        return (
          <NewProjectView
            closeModal={showCancelProject}
            nextView={goToTranscriptionChoiceView}
            projectName={projectName}
            setProjectName={setProjectName}
          />
        );
      case TranscriptionChoiceView:
        return (
          <TranscriptionChoiceView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelProject}
            nextView={goToTranscriptionEngineConfigView}
            projectName={projectName}
          />
        );
      case CloudConfigView:
        return (
          <CloudConfigView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelProject}
            nextView={() => setCurrentView(views.importMedia)}
            projectName={projectName}
          />
        );
      case LocalConfigView:
        return (
          <LocalConfigView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelProject}
            nextView={() => setCurrentView(views.importMedia)}
            projectName={projectName}
          />
        );
      case ImportMediaView:
        return (
          <ImportMediaView
            prevView={() => setCurrentView(views.newProject)}
            closeModal={showCancelProject}
            nextView={() => setCurrentView(views.runTranscription)}
          />
        );
      case RunTranscriptionView:
        return (
          <RunTranscriptionView
            closeModal={showCancelProject}
            nextView={completeProjectCreation}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div>
      <CustomModal open={isOpen} onClose={showCancelProject}>
        <CustomModalInner
          sx={{ width: { xs: '300px', sm: '438px', lg: '500px' } }}
        >
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
