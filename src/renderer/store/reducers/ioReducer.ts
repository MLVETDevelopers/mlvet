import { Reducer } from 'redux';
import {
  EXPORT_PROGRESS_UPDATE,
  FINISH_EXPORT,
  START_EXPORT,
} from '../actions';
import { ApplicationStore, initialStore, Action, IO } from '../helpers';

const ioReducer: Reducer<ApplicationStore['io'], Action<any>> = (
  io = initialStore.io,
  action
) => {
  if (action.type === START_EXPORT) {
    return { isExporting: true, exportProgress: 0 } as IO;
  }

  if (action.type === EXPORT_PROGRESS_UPDATE) {
    return { exportProgress: action.payload } as IO;
  }

  if (action.type === FINISH_EXPORT) {
    return { isExporting: false, exportProgress: 1 } as IO;
  }

  return io;
};

export default ioReducer;
