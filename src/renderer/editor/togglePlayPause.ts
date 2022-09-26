import { videoPlaying, UpdatedPlaying } from 'renderer/store/playback/actions';
import store from '../store/store';

const togglePlayPause: () => void = () => {
  const currState = store.getState().playback.isPlaying;
  const dispatchState = {
    isPlaying: !currState,
    lastUpdated: new Date(),
  } as UpdatedPlaying;
  store.dispatch(videoPlaying(dispatchState));
};

export default togglePlayPause;
