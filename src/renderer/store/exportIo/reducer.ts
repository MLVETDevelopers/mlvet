import { Reducer } from 'redux';
import {
  EXPORT_PROGRESS_UPDATE,
  FINISH_EXPORT,
  START_EXPORT,
  CLOSE_EXPORT,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { ExportIo } from './helpers';
import { Action } from '../action';

const exportIoReducer: Reducer<ApplicationStore['exportIo'], Action<any>> = (
  exportIo = initialStore.exportIo,
  action
) => {
  if (action.type === START_EXPORT) {
    return { isExporting: true, exportProgress: 0 } as ExportIo;
  }

  if (action.type === EXPORT_PROGRESS_UPDATE) {
    return { ...exportIo, exportProgress: action.payload } as ExportIo;
  }

  if (action.type === FINISH_EXPORT) {
    return { isExporting: true, exportProgress: 1 } as ExportIo;
  }

  if (action.type === CLOSE_EXPORT) {
    return { ...exportIo, isExporting: false };
  }

  return exportIo;
};

export default exportIoReducer;
