import { ServerActionPayload } from 'collabSharedTypes';
import dispatchOp from 'renderer/store/dispatchOp';
import { ServerMessageHandler } from '../types';

const serverActionHandler: ServerMessageHandler = () => (payload) => {
  const { actions } = payload as ServerActionPayload;

  actions.forEach((action) => {
    const { clientId, id, index, ops } = action;

    console.log(`Received server action`, clientId, id, index, ops);

    ops.forEach((op) => dispatchOp(op, true));
  });
};

export default serverActionHandler;
