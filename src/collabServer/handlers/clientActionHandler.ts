import { ClientMessageHandler } from '../clientMessageHandler';

const clientActionHandler: ClientMessageHandler =
  (sessionManager) => (socket) => (payload) => {
    console.log(sessionManager, socket, payload);
  };

export default clientActionHandler;
