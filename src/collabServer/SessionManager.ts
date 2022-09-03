import {
  ClientId,
  ServerMessage,
  SessionCode,
  SessionId,
} from 'collabSharedTypes';
import { v4 as uuidv4 } from 'uuid';
import { Transcription } from 'sharedTypes';
import { UndoStack } from 'renderer/store/undoStack/helpers';
import randomatic from 'randomatic';
import { Socket } from 'socket.io';
import { CollabSessionState, SocketId } from './types';

class SessionManager {
  sessions: Record<SessionId, CollabSessionState>;

  constructor() {
    this.sessions = {};
  }

  generateSessionCode: () => SessionCode = () => {
    // Six digit capital letters e.g. EPAUYV
    return randomatic('A', 6);
  };

  defaultSessionState: (data: {
    socket: Socket;
    sessionId: SessionId;
    hostId: ClientId;
    transcription: Transcription;
    undoStack: UndoStack;
    clientName: string;
    mediaFileName: string;
    sessionCode: SessionCode;
  }) => CollabSessionState = ({
    socket,
    sessionId,
    hostId,
    transcription,
    undoStack,
    clientName,
    mediaFileName,
    sessionCode,
  }) => {
    return {
      id: sessionId,
      code: sessionCode,
      actions: [],
      clientAcks: { [hostId]: -1 },
      clients: [{ id: hostId, name: clientName }],
      host: hostId,
      sockets: { [hostId]: socket },
      initialTranscription: transcription,
      initialUndoStack: undoStack,
      mediaFileName,
    };
  };

  initSession({
    socket,
    transcription,
    undoStack,
    clientName,
    mediaFileName,
  }: {
    socket: Socket;
    transcription: Transcription;
    undoStack: UndoStack;
    clientName: string;
    mediaFileName: string;
  }): { hostId: ClientId; sessionCode: SessionCode } {
    const sessionId: SessionId = uuidv4();
    const hostId: ClientId = uuidv4();
    const sessionCode = this.generateSessionCode();

    this.sessions[sessionId] = this.defaultSessionState({
      socket,
      sessionId,
      hostId,
      transcription,
      undoStack,
      clientName,
      mediaFileName,
      sessionCode,
    });

    return { hostId, sessionCode };
  }

  isHostOfSession(sessionId: SessionId, clientId: ClientId): boolean {
    const session = this.sessions[sessionId];

    if (session === undefined) {
      return false;
    }

    // Assert that the client is the host of the session
    if (session.host !== clientId) {
      return false;
    }

    return true;
  }

  endSession(sessionId: SessionId): void {
    // Wipe the session data from memory
    delete this.sessions[sessionId];
  }

  handleGuestLeaving(sessionId: SessionId, clientId: ClientId): void {
    const session = this.sessions[sessionId];

    if (session === undefined) {
      return;
    }

    // Remove socket from sockets list
    delete session.sockets[clientId];

    // Remove client from clientAcks
    delete session.clientAcks[clientId];

    const clientIndex = session.clients.findIndex(
      (client) => client.id === clientId
    );

    if (clientIndex === -1) {
      return;
    }

    // Remove client from clients list
    session.clients.splice(clientIndex, 1);
  }

  clientIdToSocket(clientId: ClientId): Socket | null {
    // TODO(chloe): O(1) lookup
    const clientSession = Object.values(this.sessions).find((session) =>
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

  socketIdToSession(socketId: SocketId): CollabSessionState | null {
    // TODO(chloe): O(1) lookup
    const session = Object.values(this.sessions).find((potentialSession) =>
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

  sessionIdAndSocketIdToClientId(
    sessionId: SessionId,
    socketId: SocketId
  ): ClientId | null {
    const session = this.sessions[sessionId];

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

  sendMessageToClient(clientId: ClientId, message: ServerMessage): void {
    const clientSocket = this.clientIdToSocket(clientId);

    if (clientSocket === null) {
      return;
    }

    // Send the specified message
    clientSocket.emit(message.type, message.payload);
  }

  sendMessageToAllClientsInSession(
    sessionId: SessionId,
    message: ServerMessage
  ): void {
    const session = this.sessions[sessionId];

    if (session === undefined) {
      return;
    }

    const sockets = Object.values(session.sockets);

    sockets.forEach((socket) => {
      // Send the specified message
      socket.emit(message.type, message.payload);
    });
  }
}

export default SessionManager;
