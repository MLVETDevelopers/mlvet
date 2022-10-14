import { Reducer } from 'redux';
import {
  DOWNLOAD_PROGRESS_UPDATE,
  START_DOWNLOAD,
  FINISH_DOWNLOAD,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import {
  calculateTimeRemaining,
  DownloadModel,
  DownloadStateUpdatePayload,
} from './helpers';
import { Action } from '../action';

// The time between updates to the download time remaining, in milliseconds
const timeRemainingUpdateInterval = 1000;

const downloadModelReducer: Reducer<
  ApplicationStore['downloadModel'],
  Action<DownloadStateUpdatePayload>
> = (downloadModel = initialStore.downloadModel, action) => {
  if (action.type === START_DOWNLOAD) {
    return {
      ...downloadModel,
      isDownloading: true,
      isDownloadComplete: false,
      downloadProgress: 0,
      lastUpdated: action.payload.lastUpdated,
      previousDownloadProgress: 0,
      timeRemaining: null,
    } as DownloadModel;
  }

  if (action.type === DOWNLOAD_PROGRESS_UPDATE) {
    const newLastUpdated = action.payload.lastUpdated;
    const oldLastUpdated = downloadModel.lastUpdated as Date;
    const newDownloadProgress = action.payload.downloadProgress;
    const oldDownloadProgress = downloadModel.previousDownloadProgress;

    // Only update time remaining every t seconds
    if (
      newLastUpdated.getTime() - oldLastUpdated.getTime() >
      timeRemainingUpdateInterval
    ) {
      return {
        ...downloadModel,
        downloadProgress: newDownloadProgress,
        lastUpdated: newLastUpdated,
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
      downloadProgress: newDownloadProgress,
    } as DownloadModel;
  }

  if (action.type === FINISH_DOWNLOAD) {
    return {
      ...downloadModel,
      isDownloading: false,
      isDownloadComplete: true,
      downloadProgress: 1,
      lastUpdated: action.payload.lastUpdated,
      previousDownloadProgress: downloadModel.downloadProgress,
      timeRemaining: 0,
    } as DownloadModel;
  }

  return downloadModel;
};

export default downloadModelReducer;
