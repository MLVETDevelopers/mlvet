import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import StandardButton from 'renderer/components/StandardButton';
import { projectOpened } from 'renderer/store/actions';
import { ApplicationStore } from '../store/helpers';

/*
This is the page that gets displayed while you are editting a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
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
      const project = await window.electron.openProject();
      dispatch(projectOpened(project));
    } catch (err) {
      console.error(err);
    }
  };

  const saveButton = (
    <StandardButton onClick={() => window.electron.saveProject(currentProject)}>
      Save
    </StandardButton>
  );

  const openButton = (
    <StandardButton onClick={handleOpenProject}>Open</StandardButton>
  );

  // Turn the words in the transcription into a string
  const text = currentProject.transcription?.words
    .map((word) => {
      return word.word;
    })
    .join(' ');

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
            {text /* This is where the transcription is added */}
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
