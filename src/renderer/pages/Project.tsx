import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { projectOpened } from 'renderer/store/actions';
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
      const project = await window.electron.openProject();
      dispatch(projectOpened(project));
    } catch (err) {
      console.error(err);
    }
  };

  const saveButton = (
    <Button onClick={() => window.electron.saveProject(currentProject)}>
      Save
    </Button>
  );

  const openButton = <Button onClick={handleOpenProject}>Open</Button>;

  return (
    <div>
      <div>{saveButton}</div>
      <div>{openButton}</div>
      Current project data: <pre>{JSON.stringify(currentProject)}</pre>
    </div>
  );
};

export default ProjectPage;
