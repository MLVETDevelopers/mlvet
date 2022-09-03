import { ServerMessageHandler } from '../types';

const ackJoinSessionHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default ackJoinSessionHandler;
