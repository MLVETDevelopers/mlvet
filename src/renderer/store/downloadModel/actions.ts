import { Action } from '../action';

export const START_DOWNLOAD = 'START_DOWNLOAD';
export const DOWNLOAD_PROGRESS_UPDATE = 'DOWNLOAD_PROGRESS_UPDATE';
export const FINISH_DOWNLOAD = 'FINISH_DOWNLOAD';

export const startDownload: () => Action<null> = () => ({
  type: START_DOWNLOAD,
  payload: null,
});

export const updateDownloadProgress: (progress: number) => Action<number> = (
  progress
) => ({
  type: DOWNLOAD_PROGRESS_UPDATE,
  payload: progress,
});

export const finishDownload: () => Action<null> = () => ({
  type: FINISH_DOWNLOAD,
  payload: null,
});
