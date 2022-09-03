import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { ClientMessageType } from '../collabSharedTypes';
import initSessionHandler from './handlers/initSessionHandler';
import endSessionHandler from './handlers/endSessionHandler';
import joinSessionHandler from './handlers/joinSessionHandler';
import leaveSessionHandler from './handlers/leaveSessionHandler';
import ackServerActionHandler from './handlers/ackServerActionHandler';
import clientActionHandler from './handlers/clientActionHandler';
import { ClientMessageHandler } from './types';

const app = http.createServer();

const io = new SocketServer(app);

const clientMessageHandlers: Record<ClientMessageType, ClientMessageHandler> = {
  [ClientMessageType.INIT_SESSION]: initSessionHandler,
  [ClientMessageType.END_SESSION]: endSessionHandler,
  [ClientMessageType.JOIN_SESSION]: joinSessionHandler,
  [ClientMessageType.LEAVE_SESSION]: leaveSessionHandler,
  [ClientMessageType.ACK_SERVER_ACTION]: ackServerActionHandler,
  [ClientMessageType.CLIENT_ACTION]: clientActionHandler,
};

Object.keys(clientMessageHandlers).forEach((eventKey) => {
  io.on(eventKey, clientMessageHandlers[eventKey as ClientMessageType]);
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
