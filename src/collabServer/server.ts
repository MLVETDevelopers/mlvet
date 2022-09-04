import http from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import {
  ClientMessageHandler,
  ClientMessageHandlerInner,
  ClientMessageHandlerPayload,
} from './clientMessageHandler';
import { ClientMessageType } from '../collabSharedTypes';
import initSessionHandler from './handlers/initSessionHandler';
import joinSessionHandler from './handlers/joinSessionHandler';
import ackServerActionHandler from './handlers/ackServerActionHandler';
import clientActionHandler from './handlers/clientActionHandler';
import SessionManager from './SessionManager';
import disconnectHandler from './handlers/disconnectHandler';
import { COLLAB_SERVER_PORT, LOG_VERBOSE } from './config';

const app = http.createServer();

const io = new SocketServer(app);

const sessionManager = new SessionManager();

const clientMessageHandlers: Record<ClientMessageType, ClientMessageHandler> = {
  [ClientMessageType.INIT_SESSION]: initSessionHandler,
  [ClientMessageType.JOIN_SESSION]: joinSessionHandler,
  [ClientMessageType.ACK_SERVER_ACTION]: ackServerActionHandler,
  [ClientMessageType.CLIENT_ACTION]: clientActionHandler,
};

const wrapHandler: (
  handler: ClientMessageHandlerInner,
  clientMessageType: ClientMessageType,
  socket: Socket
) => ClientMessageHandlerPayload = (handler, clientMessageType, socket) => {
  if (!LOG_VERBOSE) {
    return handler(socket);
  }

  return (payload) => {
    console.log(
      `Received client message of type ${clientMessageType} from socket ${
        socket.id
      } with payload ${JSON.stringify(payload).slice(
        0,
        100
      )} (payload may be truncated)`
    );
    return handler(socket)(payload);
  };
};

const addHandlersForSocket: (socket: Socket) => void = (socket) => {
  Object.keys(clientMessageHandlers).forEach((eventKey) => {
    const clientMessageType = eventKey as ClientMessageType;
    const handler = clientMessageHandlers[clientMessageType](sessionManager);

    socket.on(eventKey, wrapHandler(handler, clientMessageType, socket));
  });

  socket.on('disconnect', disconnectHandler(sessionManager)(socket));
};

io.on('connection', addHandlersForSocket);

io.listen(COLLAB_SERVER_PORT, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  },
});

console.log(`Listening on port ${COLLAB_SERVER_PORT}`);
