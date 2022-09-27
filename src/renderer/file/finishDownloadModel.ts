import { finishDownload } from 'renderer/store/downloadModel/actions';
import store from 'renderer/store/store';

const finishDownloadModel: () => void = () => {
  store.dispatch(finishDownload());
};

export default finishDownloadModel;
