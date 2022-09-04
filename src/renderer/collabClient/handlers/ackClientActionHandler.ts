import { AckClientActionPayload } from 'collabTypes/collabSharedTypes';
import {
  opQueueActionAccepted,
  opQueueActionRejected,
} from 'renderer/store/opQueue/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const ackClientActionHandler: ServerMessageHandler = () => (payload) => {
  const { id, isAccepted } = payload as AckClientActionPayload;

  const { dispatch } = store;

  // Run the actions in the op queue up to the accepted action
  const { opQueue } = store.getState();
  console.log('op queue', opQueue);

  const actionIndex = opQueue.findIndex((item) => item.actionId === id);

  if (actionIndex === -1) {
    return;
  }

  if (isAccepted) {
    // Wipe the op queue up to the action that was run
    dispatch(opQueueActionAccepted(id));
  } else {
    // Undo all actions from the action that was rejected onwards
    opQueue
      .slice(actionIndex)
      .map((item) => item.op)
      .forEach((op) => op.undo.forEach(dispatch));

    dispatch(opQueueActionRejected(id));
  }
};

export default ackClientActionHandler;
