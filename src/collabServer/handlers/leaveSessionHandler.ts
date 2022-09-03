import { ClientMessageHandler } from 'collabServer/clientMessageHandler';

const leaveSessionHandler: ClientMessageHandler =
  (sessionManager) => (socket, payload) => {};

export default leaveSessionHandler;
