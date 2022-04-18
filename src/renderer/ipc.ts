import { Project, Transcription } from '../sharedTypes';
import { projectOpened, pageChanged } from './store/actions';
import { ApplicationPage } from './store/helpers';
import store from './store/store';

const { ipcRenderer } = window.electron;

export const requestTranscription: (
  filePath: string
) => Promise<Transcription> = (filePath) =>
  ipcRenderer.invoke('transcribe-media', filePath);

export const saveProject: (project: Project) => Promise<void> = (project) =>
  ipcRenderer.invoke('save-project', project);

export const openProject: () => Promise<Project> = () =>
  ipcRenderer.invoke('open-project');

/**
 * Used by backend to initiate saves from front end
 */
ipcRenderer.on('initiate-save-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  await saveProject(currentProject);
});

/**
 * Used by backend to notify front end that a project was opened
 */
ipcRenderer.on('project-opened', async (_event, project: Project) => {
  store.dispatch(projectOpened(project));
  store.dispatch(pageChanged(ApplicationPage.PROJECT));
});
