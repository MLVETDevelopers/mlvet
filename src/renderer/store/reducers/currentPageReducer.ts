import { PAGE_CHANGED } from '../actions';
import {
  ApplicationStore,
  initialStore,
  ApplicationPage,
  Action,
} from '../helpers';

const currentPageReducer: (
  currentPage: ApplicationStore['currentPage'],
  action: Action<any>
) => ApplicationStore['currentPage'] = (
  currentPage = initialStore.currentPage,
  action
) => {
  if (action.type === PAGE_CHANGED) {
    return action.payload as ApplicationPage;
  }

  return currentPage;
};

export default currentPageReducer;
