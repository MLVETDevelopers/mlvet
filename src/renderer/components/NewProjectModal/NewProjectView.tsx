import {
  styled,
  Stack,
  Box,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeProjectWithoutMedia } from 'renderer/util';
import { projectCreated } from 'renderer/store/actions';
import colors from '../../colors';
import { Project } from '../../../sharedTypes';

interface Props {
  closeModal: () => void;
  nextView: () => void;
}

const CustomStack = styled(Stack)`
  width: 100%;
  height: 100%;
`;

const CustomColumnStack = styled(CustomStack)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const CustomRowStack = styled(CustomStack)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled(Box)`
  background-color: ${colors.grey[700]};
  height: 200px;
`;

const CustomButton = styled(Button)`
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.8));
`;

const NewProjectView = ({ closeModal, nextView }: Props) => {
  const [projectName, setProjectName] = useState<string>('');
  const [isAwaitingProjectName, setIsAwaitingProjectName] =
    useState<boolean>(true);

  const dispatch = useDispatch();

  const setProjectInStore = async (project: Project) => {
    dispatch(projectCreated(project));
  };

  const handleContinue = async () => {
    const project = await makeProjectWithoutMedia(projectName);
    if (project === null) {
      return;
    }
    setProjectInStore(project);
    nextView();
  };

  const handleProjectNameInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectName(event.target.value);
    if (event.target.value !== '') {
      setIsAwaitingProjectName(false);
    } else {
      setIsAwaitingProjectName(true);
    }
  };

  const continueButton = (
    <CustomButton
      color="primary"
      onClick={handleContinue}
      disabled={isAwaitingProjectName}
      sx={{ width: '100%' }}
    >
      Continue
    </CustomButton>
  );

  const cancelButton = (
    <CustomButton color="secondary" onClick={closeModal} sx={{ width: '100%' }}>
      Cancel
    </CustomButton>
  );

  return (
    <Container>
      <CustomColumnStack>
        <CustomRowStack sx={{ alignItems: 'flex-start' }}>
          <Typography variant="h1" sx={{ color: colors.grey[400] }}>
            New Project
          </Typography>
          <IconButton
            sx={{ color: colors.yellow[500], fontSize: 36 }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </CustomRowStack>
        <CustomStack>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(event) => handleProjectNameInput(event)}
            autoFocus
          />
        </CustomStack>
        <CustomRowStack sx={{ alignItems: 'flex-end', gap: '32px' }}>
          {cancelButton}
          {continueButton}
        </CustomRowStack>
      </CustomColumnStack>
    </Container>
  );
};

export default NewProjectView;
