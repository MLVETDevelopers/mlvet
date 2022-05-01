import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from 'renderer/components/StandardButton';
import { projectOpened, projectSaved } from '../store/actions';
import { ApplicationStore } from '../store/helpers';

const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const dispatch = useDispatch();

  if (currentProject === null) {
    return null;
  }

  const handleOpenProject = async () => {
    try {
      const { project, filePath } = await window.electron.openProject();
      dispatch(projectOpened(project, filePath));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProject = async () => {
    const filePath = await window.electron.saveProject(currentProject);
    dispatch(projectSaved(currentProject.id, filePath));
  };

  const saveButton = (
    <StandardButton onClick={handleSaveProject}>Save</StandardButton>
  );

  const openButton = (
    <StandardButton onClick={handleOpenProject}>Open</StandardButton>
  );

  return (
    <>
      <Stack
        direction="row"
        sx={{
          height: 'calc(100% - 76px)',
          gap: '48px',
          px: '48px',
          py: '32px',
        }}
      >
        <Stack spacing={4} sx={{ flex: '5 1 0' }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#515151',
              overflow: 'auto',
              height: '100%',
            }}
          >
            {'transcription area '.repeat(150)}
          </Box>
        </Stack>
        <Box sx={{ width: '2px', backgroundColor: 'gray' }} />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box sx={{ width: '400px', height: '280px', backgroundColor: 'red' }}>
            video
          </Box>
          <div>
            <div>{saveButton}</div>
            <div>{openButton}</div>
            Current project data:{' '}
            <pre style={{ width: '200px', overflow: 'auto' }}>
              {JSON.stringify(currentProject)}
            </pre>
          </div>
        </Stack>
      </Stack>
    </>
  );
};

export default ProjectPage;
