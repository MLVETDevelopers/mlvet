import { Box, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import colors from 'renderer/colors';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useCallback, useEffect, useState } from 'react';
import { projectCreated } from 'renderer/store/currentProject/actions';
import { useKeypress } from 'renderer/utils/hooks';
import {
  updateProjectWithExtractedAudio,
  updateProjectWithMedia,
} from 'renderer/utils/project';
import { transcriptionCreated } from '../../store/transcription/actions';
import { ApplicationStore } from '../../store/sharedHelpers';
import {
  Transcription,
  AsyncState,
  RuntimeProject,
} from '../../../sharedTypes';
import MediaDisplayTranscribeProgress from './MediaDisplayTranscribeProgress';
import ipc from '../../ipc';
import { PrimaryButton } from '../Blocks/Buttons';
import { CustomColumnStack, CustomRowStack } from '../CustomStacks';

const { extractAudio } = ipc;

const { requestTranscription, getFileNameWithExtension } = ipc;

const processTranscription = async (project: RuntimeProject) =>
  requestTranscription(project);

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
});

interface Props {
  closeModal: () => void;
  nextView: () => void;
}

const RunTranscriptionView = ({ closeModal, nextView }: Props) => {
  const [asyncState, setAsyncState] = useState<AsyncState>(AsyncState.READY);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const dispatch = useDispatch();

  const setTranscription: (transcription: Transcription) => void = useCallback(
    (transcription) => dispatch(transcriptionCreated(transcription)),
    [dispatch]
  );

  useEffect(() => {
    if (
      currentProject === null ||
      currentProject.mediaFilePath === null ||
      asyncState !== AsyncState.READY
    ) {
      return;
    }
    const { mediaFilePath } = currentProject;

    if (mediaFilePath === null) {
      return;
    }
    const setCurrentProject = (project: RuntimeProject) => {
      return dispatch(projectCreated(project));
    };

    const extractProjectAudio = async () => {
      const audioFilePath = await extractAudio(currentProject);
      const projectWithAudioExtract = await updateProjectWithExtractedAudio(
        currentProject,
        audioFilePath
      );
      if (projectWithAudioExtract === null) {
        return;
      }
      setCurrentProject(projectWithAudioExtract);
    };

    setAsyncState(AsyncState.LOADING);

    const startProcessing = async () => {
      await updateProjectWithMedia(currentProject, mediaFilePath);
      await extractProjectAudio();
      try {
        const processedTranscription = await processTranscription(
          currentProject
        );
        if (processedTranscription === null) {
          throw new Error();
        }
        setAsyncState(AsyncState.DONE);
        setTranscription(processedTranscription);
      } catch {
        setAsyncState(AsyncState.ERROR);
      }
    };

    startProcessing();
  }, [
    currentProject,
    setAsyncState,
    nextView,
    setTranscription,
    asyncState,
    dispatch,
  ]);

  useKeypress(nextView, asyncState === AsyncState.DONE, [
    'Enter',
    'NumpadEnter',
  ]);

  if (currentProject === null) {
    return null;
  }

  const getFileName = async () => {
    const name = await getFileNameWithExtension(currentProject.mediaFilePath);
    setMediaFileName(name);
  };

  const projectName = currentProject.name;
  getFileName();

  const completedButton = (
    <PrimaryButton onClick={nextView} fullWidth>
      Get Started
    </PrimaryButton>
  );

  return (
    <Container sx={{ height: { xs: 400 } }}>
      <CustomColumnStack
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ height: '15%' }}
      >
        <CustomRowStack justifyContent="space-between">
          <Typography
            overflow="hidden"
            textOverflow="ellipsis"
            variant="h1"
            noWrap
            sx={{ color: colors.grey[400] }}
          >
            {projectName}
          </Typography>
          <IconButton
            sx={{ color: colors.yellow[500], fontSize: 20 }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </CustomRowStack>
        <Typography variant="p-400" sx={{ color: colors.grey[300] }}>
          Please wait while we transcribe your video
        </Typography>
      </CustomColumnStack>
      <CustomColumnStack
        alignItems="baseline"
        justifyContent="flex-start"
        marginTop="25px"
        sx={{ height: '70%' }}
      >
        <MediaDisplayTranscribeProgress
          fileName={mediaFileName}
          asyncState={asyncState}
        />
      </CustomColumnStack>
      <CustomRowStack>
        {asyncState === AsyncState.DONE ? completedButton : <></>}
      </CustomRowStack>
    </Container>
  );
};

export default RunTranscriptionView;
