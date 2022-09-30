import { Modal, styled, Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { TranscriptionEngine } from 'sharedTypes';
import CloudConfigView from './CloudConfigView';
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
  onClose: () => void;
  projectName: string;
}

const views = {
  transcriptionChoice: 'transcriptionChoice',
  localConfig: 'localConfig',
  cloudConfig: 'cloudConfig',
};

const MenuConfiguration = ({ isOpen, onClose, projectName }: Props) => {
  const [currentView, setCurrentView] = useState<string>(
    views.transcriptionChoice
  );
  const [isShowingCancelModal, setIsShowingCancelModal] = useState(false);

  const handleModalClose: () => void = () => {
    onClose();
    setCurrentView(views.transcriptionChoice);
  };

  const closeCancelModal = () => setIsShowingCancelModal(false);

  const showCancelModal = () => {
    setIsShowingCancelModal(true);
  };

  const viewComponents = useMemo(() => {
    return {
      [views.transcriptionChoice]: TranscriptionChoiceView,
      [views.localConfig]: LocalConfigView,
      [views.cloudConfig]: CloudConfigView,
    };
  }, []);

  const goToTranscriptionEngineConfigView = async () => {
    // Checks if user has already configured the default transcription engine
    const areConfigRequirementsMet = await areEngineConfigRequirementsMet();
    if (areConfigRequirementsMet) {
      handleModalClose();
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
        handleModalClose();
    }
  };

  const finishConfiguration: () => void = () => {
    handleModalClose();
  };

  const view = (() => {
    const viewComponent = viewComponents[currentView];
    switch (viewComponent) {
      case TranscriptionChoiceView:
        return (
          <TranscriptionChoiceView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelModal}
            nextView={goToTranscriptionEngineConfigView}
            projectName={projectName}
          />
        );
      case CloudConfigView:
        return (
          <CloudConfigView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelModal}
            nextView={finishConfiguration}
            projectName={projectName}
          />
        );
      case LocalConfigView:
        return (
          <LocalConfigView
            prevView={() => setCurrentView(views.transcriptionChoice)}
            closeModal={showCancelModal}
            nextView={finishConfiguration}
            projectName={projectName}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <>
      <CustomModal open={isOpen} onClose={showCancelModal} id="custom-modal">
        <CustomModalInner
          id="custom-modal-inner"
          sx={{ width: { xs: '300px', sm: '438px', lg: '500px' } }}
        >
          {view}
        </CustomModalInner>
      </CustomModal>
      <CancelProjectModal
        isOpen={isShowingCancelModal}
        closeDialog={closeCancelModal}
        handleModalClose={handleModalClose}
      />
    </>
  );
};

export default MenuConfiguration;
