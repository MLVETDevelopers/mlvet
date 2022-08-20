import { updateExportProgress } from 'renderer/store/exportIo/actions';
import store from 'renderer/store/store';

const exportProgressUpdate: (progress: number) => void = (progress) => {
  store.dispatch(updateExportProgress(progress));
};

export default exportProgressUpdate;
