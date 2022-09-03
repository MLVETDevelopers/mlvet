import { ClientMessageHandler } from '../clientMessageHandler';

const ackServerActionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    console.log(sessionManager, socket, payload);
  };

export default ackServerActionHandler;
