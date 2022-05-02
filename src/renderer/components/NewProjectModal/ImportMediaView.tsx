import {
  Box,
  Button,
  colors,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { projectCreated, recentProjectAdded } from '../../store/actions';
import SelectMediaBlock from '../SelectMediaBlock';
import { Project } from '../../../sharedTypes';
import { makeProject } from '../../util';

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
  closeModal: () => void;
  nextView: () => void;
}

const ImportMediaView = ({ closeModal, nextView }: Props) => {
  const [projectName, setProjectName] = useState<string>('Example');
  const [mediaFilePath, setMediaFilePath] = useState<string | null>(null);

  const dispatch = useDispatch();

  const setCurrentProject = (project: Project) =>
    dispatch(projectCreated(project));
  const addToRecentProjects = (project: Project) =>
    dispatch(recentProjectAdded(project));

  const onProjectCreate = async () => {
    const project = await makeProject(projectName, mediaFilePath);
    if (project === null) {
      return;
    }

    setCurrentProject(project);
    addToRecentProjects(project);
    nextView();
  };

  return (
    <>
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
    </>
  );
};

export default ImportMediaView;
