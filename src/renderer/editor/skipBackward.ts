import { videoSkip } from 'renderer/store/playback/actions';
import store from '../store/store';

const skipBackward: () => void = () => {
  store.dispatch(videoSkip(-10));
};

export default skipBackward;
