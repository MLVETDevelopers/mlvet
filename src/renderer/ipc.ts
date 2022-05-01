import { Project } from '../sharedTypes';
import { projectOpened, pageChanged, projectSaved } from './store/actions';
import { ApplicationPage } from './store/helpers';
import store from './store/store';

/**
 * Used by backend to initiate saves from front end
 */
window.electron.on('initiate-save-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  const filePath = await window.electron.saveProject(currentProject);

  store.dispatch(projectSaved(currentProject.id, filePath));
});

/**
 * Used by backend to notify front end that a project was opened
 */
window.electron.on(
  'project-opened',
  async (_event, project: Project, filePath: string) => {
    store.dispatch(projectOpened(project, filePath));
    store.dispatch(pageChanged(ApplicationPage.PROJECT));
  }
);
