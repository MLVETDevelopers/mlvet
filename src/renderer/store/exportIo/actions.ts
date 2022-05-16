import { Action } from '../action';

export const START_EXPORT = 'START_EXPORT';
export const EXPORT_PROGRESS_UPDATE = 'EXPORT_PROGRESS_UPDATE';
export const FINISH_EXPORT = 'FINISH_UPDATE';

export const startExport: () => Action<null> = () => ({
  type: START_EXPORT,
  payload: null,
});

export const updateExportProgress: (progress: number) => Action<number> = (
  progress
) => ({
  type: EXPORT_PROGRESS_UPDATE,
  payload: progress,
});

export const finishExport: () => Action<null> = () => ({
  type: FINISH_EXPORT,
  payload: null,
});
