import { ServerMessageHandler } from '../types';

const serverActionHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default serverActionHandler;
