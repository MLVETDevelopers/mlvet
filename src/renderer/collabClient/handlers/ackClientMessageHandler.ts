import { ServerMessageHandler } from '../types';

const ackClientActionHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default ackClientActionHandler;
