import { styled, Stack, Box, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useKeypress from 'renderer/utils/hooks';
import { makeProjectWithoutMedia } from '../../utils/project';
import { projectCreated } from '../../store/currentProject/actions';
import colors from '../../colors';
import { RuntimeProject } from '../../../sharedTypes';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';

interface Props {
  closeModal: () => void;
  nextView: () => void;
  projectName: string;
  setProjectName: (projectName: string) => void;
}

const CustomStack = styled(Stack)({
  width: '100%',
  height: '100%',
});

const CustomColumnStack = styled(CustomStack)({
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
  height: '200px',
});

const NewProjectView = ({
  closeModal,
  nextView,
  projectName,
  setProjectName,
}: Props) => {
  const dispatch = useDispatch();

  const setProjectInStore = useCallback(
    async (project: RuntimeProject) => {
      dispatch(projectCreated(project));
    },
    [dispatch]
  );

  const handleContinue = useCallback(async () => {
    const project = await makeProjectWithoutMedia(projectName);
    if (project === null) {
      return;
    }
    setProjectInStore(project);
    nextView();
  }, [nextView, projectName, setProjectInStore]);

  useKeypress(handleContinue, projectName.trim() !== '', [
    'Enter',
    'NumpadEnter',
  ]);

  const handleProjectNameInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectName(event.target.value.trim());
  };

  const continueButton = (
    <PrimaryButton
      onClick={handleContinue}
      disabled={!projectName.trim()}
      fullWidth
    >
      Continue
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={closeModal} fullWidth>
      Cancel
    </SecondaryButton>
  );

  return (
    <Container>
      <CustomColumnStack>
        <CustomRowStack sx={{ alignItems: 'flex-start', paddingTop: '5px' }}>
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
