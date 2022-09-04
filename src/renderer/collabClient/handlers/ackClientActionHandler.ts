import { AckClientActionPayload } from 'collabSharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import {
  opQueueActionAccepted,
  opQueueActionRejected,
} from 'renderer/store/opQueue/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const ackClientActionHandler: ServerMessageHandler = () => (payload) => {
  const { id, isAccepted } = payload as AckClientActionPayload;

  const { dispatch } = store;

  if (isAccepted) {
    // Run the actions in the op queue up to the accepted action
    const { opQueue } = store.getState();

    console.log('op queue', opQueue);

    const actionIndex = opQueue.findIndex((item) => item.actionId === id);

    if (actionIndex === -1) {
      return;
    }

    // Force-dispatch all ops in the queue
    opQueue
      .slice(0, actionIndex + 1)
      .map((item) => item.op)
      .forEach((op) => dispatchOp(op, true));

    // Wipe the op queue up to the action that was run
    dispatch(opQueueActionAccepted(id));
  } else {
    dispatch(opQueueActionRejected(id));
  }
};

export default ackClientActionHandler;
