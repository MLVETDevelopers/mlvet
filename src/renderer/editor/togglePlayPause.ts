import { videoPlaying } from 'renderer/store/playback/actions';
import store from '../store/store';

const togglePlayPause: () => void = () => {
  const currState = store.getState().isVideoPlaying;
  store.dispatch(videoPlaying(!currState));
};

export default togglePlayPause;
