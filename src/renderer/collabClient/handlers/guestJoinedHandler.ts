import { ServerMessageHandler } from '../types';

const guestJoinedHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
};

export default guestJoinedHandler;
