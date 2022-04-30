import { Reducer } from 'redux';
import { PAGE_CHANGED } from '../actions';
import {
  ApplicationStore,
  initialStore,
  ApplicationPage,
  Action,
} from '../helpers';

const currentPageReducer: Reducer<
  ApplicationStore['currentPage'],
  Action<any>
> = (currentPage = initialStore.currentPage, action) => {
  if (action.type === PAGE_CHANGED) {
    return action.payload as ApplicationPage;
  }

  return currentPage;
};

export default currentPageReducer;
