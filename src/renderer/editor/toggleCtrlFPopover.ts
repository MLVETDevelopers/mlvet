import { ctrlFPopoverToggled } from 'renderer/store/ctrlFPopover/actions';
import store from '../store/store';

const toggleCtrlFPopover: () => void = () => {
  store.dispatch(ctrlFPopoverToggled());
};

export default toggleCtrlFPopover;
