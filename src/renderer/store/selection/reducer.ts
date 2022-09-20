import { Reducer } from 'redux';
import { emptyRange } from 'renderer/utils/range';
import {
  SELECTION_CLEARED,
  SelectionClearedPayload,
  SELECTION_RANGE_SET_TO,
  SelectionRangeSetToPayload,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import { updateSelection } from './helpers';

const selectionReducer: Reducer<ApplicationStore['selection'], Action<any>> = (
  selection = initialStore.selection,
  action
) => {
  if (action.type === SELECTION_RANGE_SET_TO) {
    const { range, clientId } = action.payload as SelectionRangeSetToPayload;

    return updateSelection(clientId, selection, range);
  }

  if (action.type === SELECTION_CLEARED) {
    const { clientId } = action.payload as SelectionClearedPayload;

    return updateSelection(clientId, selection, emptyRange());
  }

  return selection;
};

export default selectionReducer;
