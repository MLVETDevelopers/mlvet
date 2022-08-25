import { toggleShortcuts } from 'renderer/store/shortcuts/actions';
import store from 'renderer/store/store';

const { dispatch } = store;

const openShortcuts: () => any = async () => {
  dispatch(toggleShortcuts(true));
};

export default openShortcuts;
