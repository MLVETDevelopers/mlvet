import { ClientBroadcastPayload } from '../../collabTypes/collabSharedTypes';
import { ClientMessageHandler } from '../clientMessageHandler';

const clientBroadcastHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const { action } = payload as ClientBroadcastPayload;

    const clientId = sessionManager.lookup.socketIdToClientId(socket.id);
    const session = sessionManager.lookup.socketIdToSession(socket.id);

    if (clientId === null || session === null) {
      return;
    }

    sessionManager.handleClientBroadcast(action, clientId, session.id);
  };

export default clientBroadcastHandler;
