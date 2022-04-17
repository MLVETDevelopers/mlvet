import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { saveProject } from '../ipc';
import { ApplicationStore } from '../store/helpers';

const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const saveButton = (
    <Button onClick={() => saveProject(currentProject)}>Save</Button>
  );

  return <div>{saveButton}</div>;
};

export default ProjectPage;
