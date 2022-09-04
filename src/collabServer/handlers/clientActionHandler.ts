import { ClientActionPayload } from 'collabSharedTypes';
import { ClientMessageHandler } from '../clientMessageHandler';

const clientActionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const { id, ops } = payload as ClientActionPayload;

    const clientId = sessionManager.lookup.socketIdToClientId(socket.id);
    const session = sessionManager.lookup.socketIdToSession(socket.id);

    if (clientId === null || session === null) {
      return;
    }

    sessionManager.handleClientAction(id, ops, clientId, session.id);
  };

export default clientActionHandler;
