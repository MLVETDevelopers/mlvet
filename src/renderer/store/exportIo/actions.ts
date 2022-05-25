import { Project } from 'sharedTypes';
import { Action } from '../action';

export const START_EXPORT = 'START_EXPORT';
export const EXPORT_PROGRESS_UPDATE = 'EXPORT_PROGRESS_UPDATE';
export const FINISH_EXPORT = 'FINISH_UPDATE';

export const startExport: (
  projectId: string,
  exportFilePath: string
) => Action<{
  projectId: string;
  exportFilePath: string;
}> = (projectId, exportFilePath) => ({
  type: START_EXPORT,
  payload: { projectId, exportFilePath },
});

export const updateExportProgress: (progress: number) => Action<number> = (
  progress
) => ({
  type: EXPORT_PROGRESS_UPDATE,
  payload: progress,
});

export const finishExport: (
  project: Project,
  filePath: string | null
) => Action<{ project: Project; filePath: string | null }> = (
  project,
  filePath
) => ({
  type: FINISH_EXPORT,
  payload: { project, filePath },
});
