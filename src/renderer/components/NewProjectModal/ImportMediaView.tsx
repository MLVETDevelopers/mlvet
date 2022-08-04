import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Stack, styled, Typography } from '@mui/material';
import colors from 'renderer/colors';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ApplicationStore } from '../../store/sharedHelpers';
import { projectCreated } from '../../store/currentProject/actions';
import { RuntimeProject } from '../../../sharedTypes';
import { updateProjectWithMedia } from '../../util';
import SelectMediaBlock from '../SelectMediaBlock';
import MediaDisplayOnImport from '../MediaDisplayOnImport';
import ipc from '../../ipc';

interface Props {
  prevView: () => void;
  closeModal: () => void;
  nextView: () => void;
}

const CustomStack = styled(Stack)`
  width: 100%;
`;

const CustomColumnStack = styled(CustomStack)`
  flex-direction: column;
`;

const CustomRowStack = styled(CustomStack)`
  flex-direction: row;
  align-items: center;
`;

const Container = styled(Box)`
  background-color: ${colors.grey[700]};
`;

const CustomButton = styled(Button)`
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.8));
`;

const ImportMediaView = ({ prevView, closeModal, nextView }: Props) => {
  const [isAwaitingMedia, setIsAwaitingMedia] = useState<boolean>(true);
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  // Reset the import - for when delete button is pressed on media
  const removeMediaFromImport: () => void = () => {
    setIsAwaitingMedia(true);
    setMediaFilePath(null);
    setMediaFileName(null);
  };

  const dispatch = useDispatch();

  if (currentProject === null) {
    return null;
  }

  const projectName = currentProject.name;

  const setCurrentProject = (project: RuntimeProject) =>
    dispatch(projectCreated(project));

  const handleTranscribe = async () => {
    if (mediaFilePath === null) {
      return;
    }

    const projectWithMedia = await updateProjectWithMedia(
      currentProject,
      mediaFilePath
    );

    if (projectWithMedia === null) {
      return;
    }

    // Next view

    // setCurrentProject(projectWithAudioExtract);
    setCurrentProject(projectWithMedia);

    nextView();
  };

  const transcribeButton = (
    <CustomButton
      color="primary"
      onClick={handleTranscribe}
      disabled={isAwaitingMedia}
      sx={{ width: '100%' }}
    >
      Transcribe
    </CustomButton>
  );

  const cancelButton = (
    <CustomButton color="secondary" onClick={prevView} sx={{ width: '100%' }}>
      Back
    </CustomButton>
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
