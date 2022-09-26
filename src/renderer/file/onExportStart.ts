import { startExport } from 'renderer/store/exportIo/actions';
import store from 'renderer/store/store';

const onExportStart: (projectId: string, exportFilePath: string) => void = (
  projectId,
  exportFilePath
) => {
  store.dispatch(startExport(projectId, exportFilePath));
};

export default onExportStart;
