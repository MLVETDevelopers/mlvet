import {
  AckServerActionMessage,
  ClientMessageType,
  ServerActionPayload,
} from 'collabTypes/collabSharedTypes';
import { Action } from 'renderer/store/action';
import dispatchOp from 'renderer/store/dispatchOp';
import {
  SELECTION_CLEARED,
  SELECTION_RANGE_ADDED,
  SELECTION_RANGE_REMOVED,
  SELECTION_RANGE_SET_TO,
  SELECTION_RANGE_TOGGLED,
} from 'renderer/store/selection/actions';
import { MapCallback } from 'sharedTypes';
import { ServerMessageHandler } from '../types';

const selectionActionTypes = [
  SELECTION_RANGE_ADDED,
  SELECTION_RANGE_REMOVED,
  SELECTION_RANGE_SET_TO,
  SELECTION_RANGE_TOGGLED,
  SELECTION_CLEARED,
];

const serverActionHandler: ServerMessageHandler = (client) => (payload) => {
  const { actions, isBroadcast } = payload as ServerActionPayload;

  actions.forEach((action) => {
    const { clientId, id, index, ops } = action;

    console.log(`Received server action`, clientId, id, index, ops);

    // Inject client IDs into any selection actions
    const injectClientId: MapCallback<Action<any>, Action<any>> = (
      doOrUndoAction
    ) => {
      if (selectionActionTypes.includes(doOrUndoAction.type)) {
        return {
          ...doOrUndoAction,
          payload: { ...doOrUndoAction.payload, clientId },
        };
      }
      return doOrUndoAction;
    };

    const opsMarked = ops.map((op) => ({
      ...op,
      do: op.do.map(injectClientId),
      undo: op.undo.map(injectClientId),
    }));

    opsMarked.forEach((op) => dispatchOp(op, true));
  });

  const lastIndex = Math.max(...actions.map((action) => action.index));

  // Respond with an ack
  const ackServerActionMessage: AckServerActionMessage = {
    type: ClientMessageType.ACK_SERVER_ACTION,
    payload: {
      index: lastIndex,
    },
  };

  client.sendMessage(ackServerActionMessage);
};

export default serverActionHandler;
