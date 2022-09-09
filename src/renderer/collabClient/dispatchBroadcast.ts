import { BroadcastableAction } from 'collabTypes/collabSharedTypes';
import store from 'renderer/store/store';

const dispatchBroadcast = (action: BroadcastableAction) => {
  const client = store.getState().collab?.collabClient ?? null;
  if (client === null) {
    return;
  }

  client.sendBroadcast({ action });
};

export default dispatchBroadcast;
