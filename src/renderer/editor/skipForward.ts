import { videoSkip } from 'renderer/store/playback/actions';
import store from '../store/store';

const skipForward: () => void = () => {
  store.dispatch(videoSkip(10));
};

export default skipForward;
