import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, styled, Typography } from '@mui/material';
import colors from 'renderer/colors';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ApplicationStore } from '../../store/sharedHelpers';
import { projectCreated } from '../../store/currentProject/actions';
import { RuntimeProject } from '../../../sharedTypes';
import SelectMediaBlock from '../SelectMediaBlock';
import MediaDisplayOnImport from '../MediaDisplayOnImport';
import ipc from '../../ipc';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';

const { extractAudio } = ipc;

interface Props {
  prevView: () => void;
  closeModal: () => void;
  nextView: () => void;
}

const CustomStack = styled(Stack)({ width: '100%' });

const CustomColumnStack = styled(CustomStack)({ flexDirection: 'column' });

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
});

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
});

const ImportMediaView = ({ prevView, closeModal, nextView }: Props) => {
  const [isAwaitingMedia, setIsAwaitingMedia] = useState<boolean>(true);
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const dispatch = useDispatch();

  const setCurrentProject = (project: RuntimeProject) => {
    return dispatch(projectCreated(project));
  };

  // Reset the import - for when delete button is pressed on media
  const removeMediaFromImport: () => void = () => {
    setIsAwaitingMedia(true);
    setMediaFilePath(null);
    setMediaFileName(null);
  };

  if (currentProject === null) {
    return null;
  }

  const projectName = currentProject.name;

  const handleTranscribe = async () => {
    const projectWithMedia = {
      ...currentProject,
      mediaFilePath,
    };

    if (projectWithMedia.mediaFilePath == null) {
      return;
    }
    setCurrentProject(projectWithMedia);
    nextView();
  };

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

  return (
    <Container sx={{ height: { xs: 500 } }}>
      <CustomColumnStack
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ height: '50%' }}
      >
        <CustomRowStack justifyContent="space-between">
          <Typography
            overflow="hidden"
            textOverflow="ellipsis"
            variant="h1"
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
      <CustomRowStack justifyContent="space-between" sx={{ gap: '32px' }}>
        {cancelButton}
        {transcribeButton}
      </CustomRowStack>
    </Container>
  );
};

export default ImportMediaView;
