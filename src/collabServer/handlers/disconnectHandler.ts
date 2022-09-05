import {
  ClientId,
  DisconnectReason,
  SessionId,
} from 'collabTypes/collabShadowTypes';
import { ClientMessageHandler } from '../clientMessageHandler';
import {
  GuestLeftMessage,
  ServerMessageType,
} from '../../collabTypes/collabSharedTypes';
import SessionManager from '../SessionManager';

const endSession: (
  sessionManager: SessionManager,
  sessionId: SessionId
) => void = (sessionManager, sessionId) => {
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

  // Remove the guest from the session
  sessionManager.handleGuestLeaving(sessionId, clientId);

  // Inform all clients that a guest left
  sessionManager.sendMessageToAllClientsInSession(sessionId, guestLeftMessage);
};

const disconnectHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const reason = payload as DisconnectReason;

    console.log(`Client ${socket.id} disconnected, reason: ${reason}`);

    const session = sessionManager.lookup.socketIdToSession(socket.id);

    if (session === null) {
      console.error(`Could not load session for socket ID: ${socket.id}`);
      return;
    }

    const clientId = sessionManager.lookup.sessionIdAndSocketIdToClientId(
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
