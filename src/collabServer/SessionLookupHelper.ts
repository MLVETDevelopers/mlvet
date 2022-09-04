import { Socket } from 'socket.io';
import {
  ClientId,
  SessionCode,
  SessionId,
} from '../collabTypes/collabSharedTypes';
import { CollabServerSessionState, SocketId } from './types';

export type SessionsGetter = () => Record<SessionId, CollabServerSessionState>;

class SessionLookupHelper {
  getSessions: SessionsGetter;

  constructor(getSessions: SessionsGetter) {
    this.getSessions = getSessions;
  }

  sessionIdAndSocketIdToClientId(
    sessionId: SessionId,
    socketId: SocketId
  ): ClientId | null {
    const session = this.getSessions()[sessionId];

    if (session === undefined) {
      console.error(`Could not find session with ID: ${sessionId}`);
      return null;
    }

    // TODO(chloe): O(1) lookup
    const clientId = Object.keys(session.sockets).find(
      (potentialClientId) => session.sockets[potentialClientId].id === socketId
    );

    if (clientId === undefined) {
      console.error(`Could not find client ID for session: ${session}`);
      return null;
    }

    return clientId;
  }

  socketIdToSession(socketId: SocketId): CollabServerSessionState | null {
    // TODO(chloe): O(1) lookup
    const session = Object.values(this.getSessions()).find((potentialSession) =>
      Object.values(potentialSession.sockets).some(
        (socket) => socket.id === socketId
      )
    );

    if (session === undefined) {
      console.error(`Could not find client ID for socket ID: ${socketId}`);
      return null;
    }

    return session;
  }

  socketIdToClientId(socketId: SocketId): ClientId | null {
    const session = this.socketIdToSession(socketId);

    if (session === null) {
      return null;
    }

    const foundClientId = Object.keys(session.sockets).find(
      (clientId) => session.sockets[clientId].id === socketId
    );

    if (foundClientId === undefined) {
      return null;
    }

    return foundClientId;
  }

  clientIdToSocket(clientId: ClientId): Socket | null {
    // TODO(chloe): O(1) lookup
    const clientSession = Object.values(this.getSessions()).find((session) =>
      session.clients.some((client) => client.id === clientId)
    );

    if (clientSession === undefined) {
      console.error(`Could not find session for client ID: ${clientId}`);
      return null;
    }

    const clientSocket = clientSession.sockets[clientId];

    if (clientSocket === undefined) {
      console.log(
        `Could not find socket for client ID: ${clientId} and session: ${clientSession}`
      );
      return null;
    }

    return clientSocket;
  }

  findSessionByCode(sessionCode: SessionCode): CollabServerSessionState | null {
    // TODO(chloe): O(1) lookup
    const foundSession = Object.values(this.getSessions()).find(
      (session) => session.code === sessionCode
    );

    return foundSession ?? null;
  }
}

export default SessionLookupHelper;
