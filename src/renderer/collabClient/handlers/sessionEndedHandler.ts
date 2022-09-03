import { ServerMessageHandler } from '../types';

const sessionEndedHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default sessionEndedHandler;
