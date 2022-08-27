import { Action } from '../action';

export const SHORTCUTS_TOGGLED = 'SHORTCUTS_TOGGLED';

export const toggleShortcuts: (shortcutsOpened: boolean) => Action<boolean> = (
  shortcutsOpened
) => ({
  type: SHORTCUTS_TOGGLED,
  payload: shortcutsOpened,
});
