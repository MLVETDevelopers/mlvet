import { Project, RecentProject, Word } from '../../sharedTypes';
import { ApplicationPage } from './currentPage/helpers';
import { ExportIo } from './exportIo/helpers';
import { UndoStack } from './undoStack/helpers';

/**
 * The schema for the root-level application / redux store, containing the global app state.
 */
export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: RecentProject[];
  currentPage: ApplicationPage;
  undoStack: UndoStack;
  exportIo: ExportIo;
  clipboard: Word[];
}

/**
 * The initial state of the application store / redux store.
 * This is what the store looks like every time the application starts.
 */
export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [],
  currentPage: ApplicationPage.HOME,
  undoStack: { stack: [], index: 0 },
  exportIo: { isExporting: false, exportProgress: 0 },
  clipboard: [],
};
