import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, styled } from '@mui/material';
import colors from 'renderer/colors';
import CloseIcon from '@mui/icons-material/Close';
import { ApplicationStore } from 'renderer/store/helpers';
import { projectCreated, recentProjectAdded } from 'renderer/store/actions';
import { Project } from 'sharedTypes';
import { updateProjectWithMedia } from 'renderer/util';
import ActionButton from '../ActionButton';
import CancelButton from '../CancelButton';
import ModalTitle from '../ModalTitle';
import SelectMediaBlock from '../SelectMediaBlock';
import MediaDisplayOnUpload from '../MediaDisplayOnUpload';

interface Props {
  prevView: () => void;
  closeModal: () => void;
  nextView: () => void;
}

const CustomStack = styled(Stack)`
  width: 100%;
`;

const Container = styled(Box)`
  background-color: ${colors.grey[700]};
  height: calc(30vw);
`;

const UploadVideoView = ({ prevView, closeModal, nextView }: Props) => {
  const [isAwaitingMedia, setIsAwaitingMedia] = useState<boolean>(true);
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const dispatch = useDispatch();

  if (currentProject === null) {
    return null;
  }

  const projectName = currentProject.name;

  const setCurrentProject = (project: Project) =>
    dispatch(projectCreated(project));
  const addToRecentProjects = (project: Project) =>
    dispatch(recentProjectAdded(project));

  const handleTranscribe = async () => {
    const project = await updateProjectWithMedia(currentProject, mediaFilePath);

    if (project === null || mediaFilePath === null) {
      return;
    }

    setCurrentProject(project);
    addToRecentProjects(project);

    nextView();
  };

  const transcribeButton = (
    <ActionButton onClick={handleTranscribe} disabled={isAwaitingMedia}>
      Transcribe
    </ActionButton>
  );

  const cancelButton = <CancelButton onClick={prevView}>Back</CancelButton>;

  return (
    <Container>
      <CustomStack
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ height: '50%' }}
      >
        <CustomStack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <ModalTitle>{projectName}</ModalTitle>
          <Box onClick={closeModal}>
            <CloseIcon sx={{ color: colors.yellow[500], fontSize: 36 }} />
          </Box>
        </CustomStack>
        <CustomStack
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <SelectMediaBlock
            setMediaFileName={setMediaFileName}
            setMediaFilePath={setMediaFilePath}
            setIsAwaitingMedia={setIsAwaitingMedia}
          />
        </CustomStack>
      </CustomStack>
      <CustomStack
        direction="column"
        alignItems="baseline"
        justifyContent="flex-start"
        sx={{ height: '45%' }}
      >
        <MediaDisplayOnUpload fileName={mediaFileName} />
      </CustomStack>
      <CustomStack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {cancelButton}
        {transcribeButton}
      </CustomStack>
    </Container>
  );
};

export default UploadVideoView;