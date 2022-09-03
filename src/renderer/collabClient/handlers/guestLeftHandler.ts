import { ServerMessageHandler } from '../types';

const guestLeftHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default guestLeftHandler;
