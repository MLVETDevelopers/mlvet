import { Reducer } from 'redux';
import { EXPORT_PROGRESS_UPDATE } from '../actions';
import { ApplicationStore, initialStore, Action, IO } from '../helpers';

const ioReducer: Reducer<ApplicationStore['io'], Action<any>> = (
  io = initialStore.io,
  action
) => {
  if (action.type === EXPORT_PROGRESS_UPDATE) {
    return { exportProgress: action.payload } as IO;
  }

  return io;
};

export default ioReducer;
