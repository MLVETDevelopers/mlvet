import { Reducer } from 'redux';
import { EXPORT_PROGRESS_UPDATE, FINISH_EXPORT, START_EXPORT } from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { ExportIO } from './helpers';
import { Action } from '../action';

const exportIoReducer: Reducer<ApplicationStore['exportIo'], Action<any>> = (
  exportIo = initialStore.exportIo,
  action
) => {
  if (action.type === START_EXPORT) {
    return { isExporting: true, exportProgress: 0 } as ExportIO;
  }

  if (action.type === EXPORT_PROGRESS_UPDATE) {
    return { exportProgress: action.payload } as ExportIO;
  }

  if (action.type === FINISH_EXPORT) {
    return { isExporting: false, exportProgress: 1 } as ExportIO;
  }

  return exportIo;
};

export default exportIoReducer;
