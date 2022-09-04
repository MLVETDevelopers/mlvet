import { ActionId, ClientMessage, SessionCode } from 'collabSharedTypes';
import { Action } from 'renderer/store/action';
import { Op } from 'renderer/store/undoStack/helpers';
import { OpPayload } from 'renderer/store/undoStack/opPayloads';

interface ICollabClient {
  sendMessage: (message: ClientMessage) => void;

  dispatchToStore: (action: Action<any>) => void;

  getClientName: () => string | null;

  joinSession: (clientName: string, sessionCode: SessionCode) => void;

  sendOp: (op: Op<OpPayload, OpPayload>) => ActionId;
}

export default ICollabClient;
