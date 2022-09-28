import { videoSkip, videoPlaying } from 'renderer/store/playback/actions';
import store from '../store/store';

const skipForward: () => void = () => {
  const duration = store.getState().currentProject?.transcription?.duration;
  const { time } = store.getState().playback;
  if (duration !== undefined) {
    const dispatchState = {
      addtime: 10,
      lastUpdated: new Date(),
      maxDuration: duration,
    };
    store.dispatch(videoSkip(dispatchState));
    if (time + 10 >= duration) {
      store.dispatch(
        videoPlaying({ isPlaying: false, lastUpdated: new Date() })
      );
    }
  }
};

export default skipForward;
