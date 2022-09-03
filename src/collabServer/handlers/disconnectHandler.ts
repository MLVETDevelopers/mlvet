import { ClientMessageHandler } from '../clientMessageHandler';
import {
  ClientId,
  DisconnectReason,
  GuestLeftMessage,
  ServerMessageType,
  SessionEndedMessage,
  SessionId,
} from '../../collabSharedTypes';
import SessionManager from '../SessionManager';

const endSession: (
  sessionManager: SessionManager,
  sessionId: SessionId
) => void = (sessionManager, sessionId) => {
  const sessionEndedMessage: SessionEndedMessage = {
    type: ServerMessageType.SESSION_ENDED,
    payload: null,
  };

  // Inform all clients that the session is ended
  // This is done before the actual session is ended because the session is needed
  // to retrieve the client socket IDs
  sessionManager.sendMessageToAllClientsInSession(
    sessionId,
    sessionEndedMessage
  );

  // End the session
  sessionManager.endSession(sessionId);
};

const leaveSession: (
  sessionManager: SessionManager,
  sessionId: SessionId,
  clientId: ClientId
) => void = (sessionManager, sessionId, clientId) => {
  const guestLeftMessage: GuestLeftMessage = {
    type: ServerMessageType.GUEST_LEFT,
    payload: {
      clientId,
    },
  };

  // Inform all clients that the session is ended
  // This is done before the actual session is ended because the session is needed
  // to retrieve the client socket IDs
  sessionManager.sendMessageToAllClientsInSession(sessionId, guestLeftMessage);

  // End the session
  sessionManager.handleGuestLeaving(sessionId, clientId);
};

const disconnectHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const reason = payload as DisconnectReason;

    console.log(`Client ${socket.id} disconnected, reason: ${reason}`);

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

    if (sessionManager.isHostOfSession(session.id, clientId)) {
      endSession(sessionManager, session.id);
    } else {
      leaveSession(sessionManager, session.id, clientId);
    }
  };

export default disconnectHandler;
