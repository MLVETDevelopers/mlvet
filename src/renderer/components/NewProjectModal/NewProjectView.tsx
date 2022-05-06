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

const NewProjectView = ({ closeModal, nextView }: Props) => {
  const [projName, setProjName] = useState<string>('');
  const [isAwaitingProjectName, setIsAwaitingProjectName] =
    useState<boolean>(true);

  const dispatch = useDispatch();

  const setProjectInStore = async (project: Project) => {
    dispatch(projectCreated(project));
  };

  const handleContinue = async () => {
    const project = await makeProjectWithoutMedia(projName);
    if (project === null) {
      return;
    }
    setProjectInStore(project);
    nextView();
  };

  const handleProjectNameInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjName(event.target.value);
    if (event.target.value !== '') {
      setIsAwaitingProjectName(false);
    } else {
      setIsAwaitingProjectName(true);
    }
  };

  const continueButton = (
    <Button
      color="primary"
      onClick={handleContinue}
      disabled={isAwaitingProjectName}
      sx={{ width: '40%' }}
    >
      Continue
    </Button>
  );

  const cancelButton = (
    <Button color="secondary" onClick={closeModal} sx={{ width: '40%' }}>
      Cancel
    </Button>
  );

  return (
    <Container>
      <CustomColumnStack>
        <CustomRowStack>
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
            value={projName}
            onChange={(event) => handleProjectNameInput(event)}
          />
        </CustomStack>
        <CustomRowStack>
          {cancelButton}
          {continueButton}
        </CustomRowStack>
      </CustomColumnStack>
    </Container>
  );
};

export default NewProjectView;
