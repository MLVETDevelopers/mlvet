import { Reducer } from 'redux';
import {
  DOWNLOAD_PROGRESS_UPDATE,
  START_DOWNLOAD,
  FINISH_DOWNLOAD,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { calculateTimeRemaining, DownloadModel } from './helpers';
import { Action } from '../action';

// The time between updates to the download time remaining, in milliseconds
const timeRemainingUpdateInterval = 1000;

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
      lastUpdated: new Date(),
      previousDownloadProgress: 0,
      timeRemaining: null,
    } as DownloadModel;
  }

  if (action.type === DOWNLOAD_PROGRESS_UPDATE) {
    const newLastUpdated = new Date();
    const oldLastUpdated = downloadModel.lastUpdated as Date;
    const newDownloadProgress = action.payload;
    const oldDownloadProgress = downloadModel.previousDownloadProgress;
    // Only update time remaining every t seconds
    if (
      newLastUpdated.getTime() - oldLastUpdated.getTime() >
      timeRemainingUpdateInterval
    ) {
      return {
        ...downloadModel,
        downloadProgress: action.payload,
        lastUpdated: new Date(),
        previousDownloadProgress: downloadModel.downloadProgress,
        timeRemaining: calculateTimeRemaining(
          newLastUpdated,
          oldLastUpdated,
          newDownloadProgress,
          oldDownloadProgress
        ),
      } as DownloadModel;
    }
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
      lastUpdated: new Date(),
      previousDownloadProgress: downloadModel.downloadProgress,
      timeRemaining: 0,
    } as DownloadModel;
  }

  return downloadModel;
};

export default downloadModelReducer;
