import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, styled, Typography } from '@mui/material';
import colors from 'renderer/colors';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useKeypress } from 'renderer/utils/hooks';
import { toggleUpdateTranscriptionChoice } from 'renderer/store/menuCustomModals/actions';
import { ApplicationStore } from '../../store/sharedHelpers';
import { projectCreated } from '../../store/currentProject/actions';
import { RuntimeProject, TranscriptionEngine } from '../../../sharedTypes';
import SelectMediaBlock from './SelectMediaBlock';
import MediaDisplayOnImport from './MediaDisplayOnImport';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import { CustomColumnStack, CustomRowStack } from '../CustomStacks';
import ipc from '../../ipc';

const { getTranscriptionEngine } = ipc;

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
});

const transcriptionEngineTextInfo = {
  [TranscriptionEngine.VOSK]: 'locally',
  [TranscriptionEngine.ASSEMBLYAI]: 'on the cloud',
  [TranscriptionEngine.DUMMY]: 'with a dummy',
};

interface Props {
  prevView: () => void;
  closeModal: () => void;
  nextView: () => void;
}

const ImportMediaView = ({ prevView, closeModal, nextView }: Props) => {
  const [isAwaitingMedia, setIsAwaitingMedia] = useState<boolean>(true);
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const [transcriptionEngineText, setTranscriptionEngineText] =
    useState<string>('');

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const isExternalTranscriptionChoiceViewOpen = useSelector(
    (store: ApplicationStore) =>
      store.menuCustomModals.isUpdateTranscriptionChoiceOpened
  );

  const dispatch = useDispatch();

  const setCurrentProject = useCallback(
    (project: RuntimeProject) => {
      dispatch(projectCreated(project));
    },
    [dispatch]
  );

  // Reset the import - for when delete button is pressed on media
  const removeMediaFromImport: () => void = () => {
    setIsAwaitingMedia(true);
    setMediaFilePath(null);
    setMediaFileName(null);
  };

  const handleTranscribe = useCallback(async () => {
    const projectWithMedia = {
      ...currentProject,
      mediaFilePath,
    };

    if (projectWithMedia.mediaFilePath == null) {
      return;
    }
    setCurrentProject(projectWithMedia as RuntimeProject);
    nextView();
  }, [currentProject, mediaFilePath, nextView, setCurrentProject]);

  useKeypress(handleTranscribe, !isAwaitingMedia, ['Enter', 'NumpadEnter']);

  useEffect(() => {
    getTranscriptionEngine()
      .then((engine) => {
        // eslint-disable-next-line promise/always-return
        if (engine !== null)
          setTranscriptionEngineText(
            transcriptionEngineTextInfo?.[engine] ?? ''
          );
      })
      .catch(() => {});
  }, [isExternalTranscriptionChoiceViewOpen]);

  if (currentProject === null) {
    return null;
  }

  const transcribeButton = (
    <PrimaryButton
      onClick={handleTranscribe}
      disabled={isAwaitingMedia}
      fullWidth
    >
      Transcribe
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={prevView} fullWidth>
      Back
    </SecondaryButton>
  );

  const changeTranscriptionEngine = () => {
    dispatch(toggleUpdateTranscriptionChoice(true));
  };

  return (
    <Container position="relative" sx={{ height: { xs: 500 } }}>
      <CustomColumnStack justifyContent="space-between" sx={{ height: '100%' }}>
        <CustomColumnStack
          justifyContent="space-between"
          sx={{ height: '100%', marginBottom: '14px' }}
        >
          <CustomColumnStack sx={{ height: '100%' }}>
            <CustomColumnStack
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <CustomRowStack id="modal-header" justifyContent="space-between">
                <Typography
                  overflow="hidden"
                  textOverflow="ellipsis"
                  variant="h1"
                  sx={{ color: colors.grey[400] }}
                >
                  {currentProject.name}
                </Typography>
                <IconButton
                  sx={{ color: colors.yellow[500], fontSize: 20 }}
                  onClick={closeModal}
                >
                  <CloseIcon />
                </IconButton>
              </CustomRowStack>
              <CustomRowStack justifyContent="center">
                <SelectMediaBlock
                  setMediaFileName={setMediaFileName}
                  setMediaFilePath={setMediaFilePath}
                  setIsAwaitingMedia={setIsAwaitingMedia}
                />
              </CustomRowStack>
            </CustomColumnStack>
            <CustomColumnStack
              alignItems="baseline"
              justifyContent="flex-start"
              sx={{ height: '42.5%', overflowY: 'auto' }}
            >
              <MediaDisplayOnImport
                fileName={mediaFileName}
                removeMediaFromImport={removeMediaFromImport}
              />
            </CustomColumnStack>
          </CustomColumnStack>
          <CustomColumnStack alignItems="start">
            <Typography
              variant="p-300"
              sx={{
                color: colors.grey[300],
                fontSize: '10px',
                lineHeight: '15px',
              }}
            >
              {`Your transcription will be processed ${transcriptionEngineText}`}
            </Typography>
            <Button
              onClick={changeTranscriptionEngine}
              variant="text"
              sx={{
                cursor: 'pointer',
                color: colors.yellow[500],
                fontSize: '10px',
                lineHeight: '14px',
                paddingY: '1px',
                paddingLeft: 0,
              }}
            >
              Change transcription method &gt;
            </Button>
          </CustomColumnStack>
        </CustomColumnStack>
        <CustomRowStack justifyContent="space-between" sx={{ gap: '32px' }}>
          {cancelButton}
          {transcribeButton}
        </CustomRowStack>
      </CustomColumnStack>
    </Container>
  );
};

export default ImportMediaView;
