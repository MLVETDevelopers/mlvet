import { AckServerActionPayload } from 'collabSharedTypes';
import { ClientMessageHandler } from '../clientMessageHandler';

const ackServerActionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    const { index } = payload as AckServerActionPayload;

    sessionManager.handleClientAck(socket.id, index);
  };

export default ackServerActionHandler;
