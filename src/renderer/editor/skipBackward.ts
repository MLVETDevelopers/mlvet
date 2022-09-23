import { videoSkip, UpdatedTimeSkip } from 'renderer/store/playback/actions';
import store from '../store/store';

const skipBackward: () => void = () => {
  const dispatchState = {
    addtime: -10,
    lastUpdated: new Date(),
    maxDuration: store.getState().currentProject?.transcription?.duration,
  } as UpdatedTimeSkip;
  store.dispatch(videoSkip(dispatchState));
};

export default skipBackward;
