import { ClientMessageHandler } from '../clientMessageHandler';

const leaveSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    console.log(sessionManager, socket, payload);
  };

export default leaveSessionHandler;
