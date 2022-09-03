import { ClientMessageHandler } from '../clientMessageHandler';
import {
  AckEndSessionMessage,
  ServerMessageType,
  SessionEndedMessage,
} from '../../collabSharedTypes';

const endSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => () => {
    const session = sessionManager.socketIdToSession(socket.id);

    if (session === null) {
      console.error(`Could not load session for socket ID: ${socket.id}`);
      return;
    }

    const clientId = sessionManager.sessionIdAndSocketIdToClientId(
      session.id,
      socket.id
    );

    if (clientId === null) {
      console.error(`Could not end session for socket ID: ${socket.id}`);
      return;
    }

    if (!sessionManager.isHostOfSession(session.id, clientId)) {
      console.error(
        `Client ${clientId} is not the host of session ${session.id}, could not end session`
      );
      return;
    }

    const ackEndSessionMessage: AckEndSessionMessage = {
      type: ServerMessageType.ACK_END_SESSION,
      payload: null,
    };

    const sessionEndedMessage: SessionEndedMessage = {
      type: ServerMessageType.SESSION_ENDED,
      payload: null,
    };

    // Acknowledge to the client that the session was ended
    // This is done before the actual session is ended because the session is needed
    // to retrieve the client socket IDs
    sessionManager.sendMessageToClient(clientId, ackEndSessionMessage);
    sessionManager.sendMessageToAllClientsInSession(
      session.id,
      sessionEndedMessage
    );

    // End the session
    sessionManager.endSession(session.id);
  };

export default endSessionHandler;
