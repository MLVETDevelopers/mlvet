import { updateDownloadProgress } from 'renderer/store/downloadModel/actions';
import store from 'renderer/store/store';

const downloadModelProgressUpdate: (progress: number) => void = (progress) => {
  store.dispatch(updateDownloadProgress(progress));
};

export default downloadModelProgressUpdate;
