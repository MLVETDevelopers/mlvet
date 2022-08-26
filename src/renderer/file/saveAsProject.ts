import { v4 as uuidv4 } from 'uuid';
import store from 'renderer/store/store';
import { RuntimeProject } from 'sharedTypes';
import ipc from 'renderer/ipc';
import {
  projectOpened,
  projectSaved,
} from 'renderer/store/currentProject/actions';
import { removeExtension } from '../utils/file';

const saveAsProject: () => Promise<void> = async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save-as if we don't have a project open or if the project doesn't have an existing save path
  if (currentProject === null || currentProject.projectFilePath === null)
    return;

  // Generate a deep-copy of the project, with new ID and name
  const newProject = JSON.parse(
    JSON.stringify(currentProject)
  ) as RuntimeProject;
  newProject.name = `Copy of ${currentProject.name}`;
  newProject.id = uuidv4();

  // TODO(chloe): regenerate thumbnail and audio extract

  const filePath = await ipc.saveAsProject(newProject);

  const savedFileNameWithExtension = await ipc.getFileNameWithExtension(
    filePath
  );

  const savedFileName = removeExtension(savedFileNameWithExtension);

  // Update the saved file name to the name that it was actually saved as, rather than the default 'Copy of ...'
  newProject.name = savedFileName;

  // Add to recent projects
  const projectMetadata = await ipc.retrieveProjectMetadata({
    ...currentProject,
    projectFilePath: filePath,
  });

  store.dispatch(projectSaved(newProject, projectMetadata, filePath));
  store.dispatch(projectOpened(newProject, filePath, projectMetadata));

  ipc.setFileRepresentation(filePath, false);
};

export default saveAsProject;
