import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import { finishExport } from 'renderer/store/exportIo/actions';
import store from 'renderer/store/store';
import { RuntimeProject } from 'sharedTypes';

const onExportFinish: (project: RuntimeProject, filePath: string) => void = (
  project,
  filePath
) => {
  store.dispatch(finishExport(project, filePath));
  store.dispatch(pageChanged(ApplicationPage.PROJECT));
};

export default onExportFinish;
