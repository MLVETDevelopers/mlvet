import { Action } from '../action';
import {
  createDownloadStateUpdatePayload,
  DownloadStateUpdatePayload,
} from './helpers';

export const START_DOWNLOAD = 'START_DOWNLOAD';
export const DOWNLOAD_PROGRESS_UPDATE = 'DOWNLOAD_PROGRESS_UPDATE';
export const FINISH_DOWNLOAD = 'FINISH_DOWNLOAD';

export const startDownload: () => Action<DownloadStateUpdatePayload> = () => ({
  type: START_DOWNLOAD,
  payload: createDownloadStateUpdatePayload(0),
});

export const updateDownloadProgress: (
  progress: number
) => Action<DownloadStateUpdatePayload> = (progress) => ({
  type: DOWNLOAD_PROGRESS_UPDATE,
  payload: createDownloadStateUpdatePayload(progress),
});

export const finishDownload: () => Action<DownloadStateUpdatePayload> = () => ({
  type: FINISH_DOWNLOAD,
  payload: createDownloadStateUpdatePayload(1),
});
