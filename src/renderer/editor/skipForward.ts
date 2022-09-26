import { videoSkip } from 'renderer/store/playback/actions';
import store from '../store/store';

const skipForward: () => void = () => {
  const duration = store.getState().currentProject?.transcription?.duration;
  if (duration !== undefined) {
    const dispatchState = {
      addtime: 10,
      lastUpdated: new Date(),
      maxDuration: duration,
    };
    store.dispatch(videoSkip(dispatchState));
  }
};

export default skipForward;
