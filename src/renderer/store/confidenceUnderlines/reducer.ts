import { Reducer } from 'redux';
import { CONFIDENCE_UNDERLINES_TOGGLED } from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const confidenceUnderlinesReducer: Reducer<
  ApplicationStore['isShowingConfidenceUnderlines'],
  Action<any>
> = (
  isShowingConfidenceUnderlines = initialStore.isShowingConfidenceUnderlines,
  action
) => {
  if (action.type === CONFIDENCE_UNDERLINES_TOGGLED) {
    return !isShowingConfidenceUnderlines;
  }

  return isShowingConfidenceUnderlines;
};

export default confidenceUnderlinesReducer;
