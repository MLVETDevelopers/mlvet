import {
  Box,
  Button,
  colors,
  Modal,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { projectCreated, recentProjectAdded } from '../store/actions';
import { Project } from '../store/helpers';
import { makeProject } from '../util';
import SelectMediaBlock from './SelectMediaBlock';

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalInner = styled(Box)`
  width: calc(80vw - 40px);
  background: ${colors.grey[900]};
  padding: 20px;
`;

const CustomTextField = styled(TextField)`
  background: ${colors.grey[400]};
  color: ${colors.grey[900]};
  width: 400px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const CustomButtonBase = styled(Button)`
  border-radius: 0;
  font-weight: bold;
  color: ${colors.grey[900]};
  text-transform: none;
  margin: 20px 10px;
  padding: 10px;
`;

const CancelButton = styled(CustomButtonBase)`
  background: ${colors.grey[400]};

  &:hover {
    background: ${colors.grey[600]};
  }
`;

const ActionButton = styled(CustomButtonBase)`
  background: ${colors.lightBlue[500]};

  &:hover {
    background: ${colors.lightBlue[700]};
  }
`;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const NewProjectModal = ({ isOpen, closeModal }: Props) => {
  const [projectName, setProjectName] = useState<string>('Example');
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);

  const dispatch = useDispatch();

  const setCurrentProject = (project: Project) =>
    dispatch(projectCreated(project));
  const addToRecentProjects = (project: Project) =>
    dispatch(recentProjectAdded(project));

  const onProjectCreate = () => {
    const project = makeProject(projectName, mediaFilePath);
    if (project === null) {
      return;
    }

    setCurrentProject(project);
    addToRecentProjects(project);
    closeModal();
  };

  return (
    <CustomModal open={isOpen} onClose={closeModal}>
      <CustomModalInner>
        <Typography fontWeight="bold">New Project</Typography>
        <CustomTextField
          sx={{ marginTop: '40px' }}
          label="Project Name"
          variant="outlined"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
        />
        <SelectMediaBlock
          mediaFilePath={mediaFilePath}
          setMediaFilePath={setMediaFilePath}
        />
        <ButtonContainer>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ActionButton onClick={onProjectCreate}>Create!</ActionButton>
        </ButtonContainer>
      </CustomModalInner>
    </CustomModal>
  );
};

export default NewProjectModal;
