import { startDownload } from 'renderer/store/downloadModel/actions';
import store from 'renderer/store/store';

const startDownloadModel: () => void = () => {
  store.dispatch(startDownload());
};

export default startDownloadModel;
