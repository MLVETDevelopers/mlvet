import { ClientMessagePayload } from 'collabSharedTypes';
import { Socket } from 'socket.io';

export type ClientMessageHandler = (
  socket: Socket,
  payload: ClientMessagePayload
) => void;
