import { ClientMessageHandler } from '../clientMessageHandler';

const joinSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    console.log(sessionManager, socket, payload);
  };

export default joinSessionHandler;
