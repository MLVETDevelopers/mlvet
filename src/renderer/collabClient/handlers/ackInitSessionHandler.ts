import { ServerMessageHandler } from '../types';

const ackInitSessionHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default ackInitSessionHandler;
