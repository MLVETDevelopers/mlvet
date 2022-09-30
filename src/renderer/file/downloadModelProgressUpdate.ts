import {
  finishDownload,
  startDownload,
  updateDownloadProgress,
} from 'renderer/store/downloadModel/actions';
import store from 'renderer/store/store';
import { DownloadingModelState } from '../../sharedTypes';

interface ProgressUpdatePayload {
  progress: number;
}

interface DownloadModelStateUpdate {
  type: DownloadingModelState;
  payload: ProgressUpdatePayload | null;
}

type UpdateDownloadModelState = (stateUpdate: DownloadModelStateUpdate) => void;

const updateDownloadModelState: UpdateDownloadModelState = (stateUpdate) => {
  switch (stateUpdate.type) {
    case DownloadingModelState.START_DOWNLOAD:
      store.dispatch(startDownload());
      return;
    case DownloadingModelState.DOWNLOAD_PROGRESS_UPDATE:
      store.dispatch(
        updateDownloadProgress(
          (stateUpdate.payload as ProgressUpdatePayload).progress
        )
      );
      return;
    case DownloadingModelState.FINISH_DOWNLOAD:
      store.dispatch(finishDownload());
      // eslint-disable-next-line no-useless-return
      return;
    default:
  }
};

export default updateDownloadModelState;
