import { ActionId, SessionCode } from 'collabTypes/collabShadowTypes';
import {
  ClientBroadcastPayload,
  ClientMessage,
} from 'collabTypes/collabSharedTypes';
import { Action } from 'renderer/store/action';
import { Op, OpPayload } from 'renderer/store/undoStack/helpers';

interface ICollabClient {
  sendMessage: (message: ClientMessage) => void;

  dispatchToStore: (action: Action<any>) => void;

  getClientName: () => string | null;

  joinSession: (clientName: string, sessionCode: SessionCode) => void;

  sendOp: (op: Op<OpPayload, OpPayload>) => ActionId;

  closeSocket: () => void;

  sendBroadcast: (payload: ClientBroadcastPayload) => void;
}

export default ICollabClient;
