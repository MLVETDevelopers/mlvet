import {
  AckServerActionMessage,
  ClientMessageType,
  ServerActionPayload,
} from 'collabSharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { ServerMessageHandler } from '../types';

const serverActionHandler: ServerMessageHandler = (client) => (payload) => {
  const { actions } = payload as ServerActionPayload;

  actions.forEach((action) => {
    const { clientId, id, index, ops } = action;

    console.log(`Received server action`, clientId, id, index, ops);

    ops.forEach((op) => dispatchOp(op, true));
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
