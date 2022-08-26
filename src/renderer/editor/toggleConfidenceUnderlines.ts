import { confidenceUnderlinesToggled } from 'renderer/store/confidenceUnderlines/actions';
import store from '../store/store';

const toggleConfidenceUnderlines: () => void = () => {
  console.log('toggling');

  store.dispatch(confidenceUnderlinesToggled());
};

export default toggleConfidenceUnderlines;
