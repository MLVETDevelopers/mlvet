import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { ClientMessageHandler } from 'collabServer/clientMessageHandler';
import { ClientMessageType } from '../collabSharedTypes';
import initSessionHandler from './handlers/initSessionHandler';
import endSessionHandler from './handlers/endSessionHandler';
import joinSessionHandler from './handlers/joinSessionHandler';
import leaveSessionHandler from './handlers/leaveSessionHandler';
import ackServerActionHandler from './handlers/ackServerActionHandler';
import clientActionHandler from './handlers/clientActionHandler';
import SessionManager from './SessionManager';

const app = http.createServer();

const io = new SocketServer(app);

const sessionManager = new SessionManager();

const clientMessageHandlers: Record<ClientMessageType, ClientMessageHandler> = {
  [ClientMessageType.INIT_SESSION]: initSessionHandler,
  [ClientMessageType.END_SESSION]: endSessionHandler,
  [ClientMessageType.JOIN_SESSION]: joinSessionHandler,
  [ClientMessageType.LEAVE_SESSION]: leaveSessionHandler,
  [ClientMessageType.ACK_SERVER_ACTION]: ackServerActionHandler,
  [ClientMessageType.CLIENT_ACTION]: clientActionHandler,
};

Object.keys(clientMessageHandlers).forEach((eventKey) => {
  io.on(
    eventKey,
    clientMessageHandlers[eventKey as ClientMessageType](sessionManager)
  );
});
