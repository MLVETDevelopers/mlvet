import { ServerMessageType } from 'collabSharedTypes';
import { Socket } from 'socket.io-client';
import ICollabClient from './ICollabClient';
import serverMessageHandlers from './serverMessageHandlers';
import { LOG_VERBOSE } from './config';
import { ServerMessageHandlerInner } from './types';
import disconnectHandler from './handlers/disconnectHandler';

const wrapHandler: (
  handler: ServerMessageHandlerInner,
  serverMessageType: ServerMessageType
) => ServerMessageHandlerInner = (handler, serverMessageType) => {
  if (!LOG_VERBOSE) {
    return handler;
  }

  return (payload) => {
    console.log(
      `Received server message of type ${serverMessageType}
        with payload ${JSON.stringify(payload).slice(
          0,
          100
        )} (payload may be truncated)`
    );
    return handler(payload);
  };
};

const registerClientCollabHandlers: (
  socket: Socket,
  client: ICollabClient
) => void = (socket, client) => {
  Object.keys(serverMessageHandlers).forEach((eventKey) => {
    const serverMessageType = eventKey as ServerMessageType;
    const handler = serverMessageHandlers[serverMessageType](client);

    socket.on(eventKey, wrapHandler(handler, serverMessageType));
  });

  socket.on('disconnect', disconnectHandler(client));
};

export default registerClientCollabHandlers;
