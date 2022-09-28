import {
  AckJoinSessionMessage,
  GuestJoinedMessage,
  JoinSessionPayload,
  ServerMessageType,
} from '../../collabTypes/collabSharedTypes';
import { ClientMessageHandler } from '../clientMessageHandler';

const joinSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const { clientName, sessionCode } = payload as JoinSessionPayload;

    try {
      // Join existing session
      const {
        clientId,
        mediaFileName,
        otherClients,
        transcription,
        undoStack,
        actions,
      } = sessionManager.joinSession({
        clientName,
        sessionCode,
        socket,
      });

      const ackJoinSessionMessage: AckJoinSessionMessage = {
        type: ServerMessageType.ACK_JOIN_SESSION,
        payload: {
          clientId,
          mediaFileName,
          otherClients,
          sessionCode,
          transcription,
          undoStack,
          actions,
          error: false,
        },
      };

      // Acknowledge to the client that the session was joined
      sessionManager.sendMessageToClient(clientId, ackJoinSessionMessage);

      const guestJoinedMessage: GuestJoinedMessage = {
        type: ServerMessageType.GUEST_JOINED,
        payload: {
          client: {
            id: clientId,
            name: clientName,
          },
        },
      };

      // Broadcast to the other clients that a guest joined
      const session = sessionManager.lookup.findSessionByCode(sessionCode);
      if (session !== null) {
        sessionManager.sendMessageToAllClientsInSession(
          session.id,
          guestJoinedMessage
        );
      }
    } catch (err) {
      const ackJoinSessionError: AckJoinSessionMessage = {
        type: ServerMessageType.ACK_JOIN_SESSION,
        payload: {
          error: true,
          message: null,
        },
      };

      sessionManager.sendMessageToSocket(socket, ackJoinSessionError);
    }
  };

export default joinSessionHandler;
