import { ClientMessageHandler } from 'collabServer/clientMessageHandler';

const ackServerActionHandler: ClientMessageHandler =
  (sessionManager) => (socket, payload) => {};

export default ackServerActionHandler;
