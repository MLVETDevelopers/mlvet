import { ClientMessagePayload } from 'collabSharedTypes';
import { Socket } from 'socket.io';
import SessionManager from './SessionManager';

export type ClientMessageHandler = (
  sessionManager: SessionManager
) => (socket: Socket, payload: ClientMessagePayload) => void;
