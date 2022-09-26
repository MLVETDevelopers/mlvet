import { videoPlaying, UpdatedPlaying } from 'renderer/store/playback/actions';
import store from '../store/store';

const togglePlayPause: () => void = () => {
  const currState = store.getState().playback;
  const currBool = currState.isPlaying;
  const currTime = currState.time;
  const maxDuration = store.getState().currentProject?.transcription?.duration;

  let dispatchState;
  if (currTime === maxDuration) {
    dispatchState = {
      isPlaying: true,
      lastUpdated: new Date(),
    } as UpdatedPlaying;
  } else {
    dispatchState = {
      isPlaying: !currBool,
      lastUpdated: new Date(),
    } as UpdatedPlaying;
  }

  store.dispatch(videoPlaying(dispatchState));
};

export default togglePlayPause;
