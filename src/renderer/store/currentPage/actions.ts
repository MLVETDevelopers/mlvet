import { Action } from '../action';
import { ApplicationPage } from './helpers';

export const PAGE_CHANGED = 'PAGE_CHANGED';

export const pageChanged: (page: ApplicationPage) => Action<ApplicationPage> = (
  page
) => ({
  type: PAGE_CHANGED,
  payload: page,
});
