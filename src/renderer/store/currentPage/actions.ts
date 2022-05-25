import ipc from '../../ipc';
import { Action } from '../action';
import { ApplicationPage } from './helpers';

export const PAGE_CHANGED = 'PAGE_CHANGED';

const { setHomeEnabled } = ipc;

const updateHomeEnabledInMenu: (page: ApplicationPage) => void = (page) => {
  const homeEnabled = page === ApplicationPage.PROJECT;

  setHomeEnabled(homeEnabled);
};

export const pageChanged: (page: ApplicationPage) => Action<ApplicationPage> = (
  page
) => {
  updateHomeEnabledInMenu(page);
  return {
    type: PAGE_CHANGED,
    payload: page,
  };
};
