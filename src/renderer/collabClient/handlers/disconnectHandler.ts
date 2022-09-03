import { DisconnectReason } from 'collabSharedTypes';
import { ServerMessageHandler } from '../types';

const disconnectHandler: ServerMessageHandler = (client) => (payload) => {
  const reason = payload as DisconnectReason;

  console.log(client, reason);
};

export default disconnectHandler;
