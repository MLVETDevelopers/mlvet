import { ClientMessageHandler } from '../clientMessageHandler';
import {
  AckInitSessionMessage,
  InitSessionPayload,
  ServerMessageType,
} from '../../collabTypes/collabSharedTypes';

const initSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const { transcription, undoStack, clientName, mediaFileName } =
      payload as InitSessionPayload;

    // Create a new session
    const { hostId, sessionCode } = sessionManager.initSession({
      socket,
      transcription,
      undoStack,
      clientName,
      mediaFileName,
    });

    const ackInitSessionMessage: AckInitSessionMessage = {
      type: ServerMessageType.ACK_INIT_SESSION,
      payload: {
        clientId: hostId,
        sessionCode,
      },
    };

    // Acknowledge to the client that the session was created
    sessionManager.sendMessageToClient(hostId, ackInitSessionMessage);
  };

export default initSessionHandler;
