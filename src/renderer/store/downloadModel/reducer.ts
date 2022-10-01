import { Reducer } from 'redux';
import {
  DOWNLOAD_PROGRESS_UPDATE,
  START_DOWNLOAD,
  FINISH_DOWNLOAD,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { DownloadModel } from './helpers';
import { Action } from '../action';

const downloadModelReducer: Reducer<
  ApplicationStore['downloadModel'],
  Action<any>
> = (downloadModel = initialStore.downloadModel, action) => {
  if (action.type === START_DOWNLOAD) {
    return {
      ...downloadModel,
      isDownloading: true,
      isDownloadComplete: false,
      downloadProgress: 0,
    } as DownloadModel;
  }

  if (action.type === DOWNLOAD_PROGRESS_UPDATE) {
    return {
      ...downloadModel,
      downloadProgress: action.payload,
    } as DownloadModel;
  }

  if (action.type === FINISH_DOWNLOAD) {
    return {
      ...downloadModel,
      isDownloading: false,
      isDownloadComplete: true,
      downloadProgress: 1,
    } as DownloadModel;
  }

  return downloadModel;
};

export default downloadModelReducer;
