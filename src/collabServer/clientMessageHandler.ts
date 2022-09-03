import { Socket } from 'socket.io';
import { ClientMessagePayload } from '../collabSharedTypes';
import SessionManager from './SessionManager';

export type ClientMessageHandlerPayload = (
  payload: ClientMessagePayload
) => void;

export type ClientMessageHandlerInner = (
  socket: Socket
) => ClientMessageHandlerPayload;

export type ClientMessageHandler = (
  sessionManager: SessionManager
) => ClientMessageHandlerInner;
