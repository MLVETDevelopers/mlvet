import { v4 as uuidv4 } from 'uuid';
import { Transcription } from 'sharedTypes';
import { Op, UndoStack, OpPayload } from 'renderer/store/undoStack/helpers';
import randomatic from 'randomatic';
import { Socket } from 'socket.io';
import {
  AckClientActionMessage,
  Client,
  ServerAction,
  ServerActionMessage,
  ServerMessage,
  ServerMessageType,
} from '../collabTypes/collabSharedTypes';
import {
  ActionId,
  ClientId,
  SessionCode,
  SessionId,
} from '../collabTypes/collabShadowTypes';
import {
  BroadcastableAction,
  CollabServerSessionState,
  ServerBroadcast,
  SocketId,
} from './types';
import SessionLookupHelper from './SessionLookupHelper';
import { sleep } from '../sharedUtils';
import { SERVER_TO_CLIENT_DELAY_SIMULATED } from './config';

class SessionManager {
  sessions: Record<SessionId, CollabServerSessionState>;

  lookup: SessionLookupHelper;

  constructor() {
    this.sessions = {};
    this.lookup = new SessionLookupHelper(() => this.sessions);
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
  }) => CollabServerSessionState = ({
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

  joinSession({
    clientName,
    sessionCode,
    socket,
  }: {
    clientName: string;
    sessionCode: SessionCode;
    socket: Socket;
  }): {
    clientId: ClientId;
    mediaFileName: string;
    otherClients: Client[];
    transcription: Transcription;
    undoStack: UndoStack;
    actions: ServerAction[];
  } {
    const session = this.lookup.findSessionByCode(sessionCode);

    if (session === null) {
      console.error(`Session with code ${sessionCode} not found`);
      throw new Error();
    }

    const clientId = uuidv4();

    const {
      initialUndoStack: undoStack,
      initialTranscription: transcription,
      clients: otherClients,
      mediaFileName,
      actions,
    } = session;

    // Add the new client to the session

    session.sockets[clientId] = socket;
    session.clientAcks[clientId] = -1;

    // Immutable because we're sending the old list as 'otherClients'
    session.clients = session.clients.concat([
      { id: clientId, name: clientName },
    ]);

    return {
      clientId,
      mediaFileName,
      otherClients,
      transcription,
      undoStack,
      actions,
    };
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
    // Close all sockets that are part of the session
    Object.values(this.sessions[sessionId].sockets).forEach((socket) =>
      socket.disconnect()
    );

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

  sendMessageToSocket: (
    socket: Socket,
    message: ServerMessage
  ) => Promise<void> = async (socket, message) => {
    // Simulate sleep if enabled
    await sleep(SERVER_TO_CLIENT_DELAY_SIMULATED);

    // Send the specified message
    socket.emit(message.type, message.payload);
  };

  sendMessageToClient(clientId: ClientId, message: ServerMessage): void {
    const clientSocket = this.lookup.clientIdToSocket(clientId);

    if (clientSocket === null) {
      return;
    }

    console.log(
      `Sending message to client ${clientId}: ${JSON.stringify(message).slice(
        0,
        100
      )} (message may be truncated)`
    );

    this.sendMessageToSocket(clientSocket, message);
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

  rejectClientAction(clientId: ClientId, actionId: ActionId): void {
    const actionRejectedMessage: AckClientActionMessage = {
      type: ServerMessageType.ACK_CLIENT_ACTION,
      payload: {
        id: actionId,
        isAccepted: false,
      },
    };

    this.sendMessageToClient(clientId, actionRejectedMessage);
  }

  acceptClientAction(
    clientId: ClientId,
    actionId: ActionId,
    ops: Op<OpPayload, OpPayload>[],
    sessionId: SessionId
  ): void {
    const session = this.sessions[sessionId];
    if (session === null) {
      return;
    }

    const actionIndex = session.actions.length;

    // Create the action and add it to the action log
    const action: ServerAction = {
      id: actionId,
      ops,
      clientId,
      index: actionIndex,
    };
    session.actions.push(action);

    // Tell the client their action was accepted
    const actionAcceptedMessage: AckClientActionMessage = {
      type: ServerMessageType.ACK_CLIENT_ACTION,
      payload: {
        id: actionId,
        isAccepted: true,
      },
    };

    this.sendMessageToClient(clientId, actionAcceptedMessage);

    // Mark the client who submitted the action as having ack'd the action
    session.clientAcks[clientId] = actionIndex;

    // Update all clients
    this.updateClientsWithLatestActions(sessionId);
  }

  handleBroadcast(
    sessionId: SessionId,
    clientId: ClientId,
    actions: BroadcastableAction[]
  ): void {
    const broadcastMessage: ServerBroadcast;

    this.sendMessageToAllClientsInSession(sessionId, broadcastMessage);
  }

  handleClientAction(
    actionId: ActionId,
    ops: Op<OpPayload, OpPayload>[],
    clientId: ClientId,
    sessionId: SessionId
  ): void {
    const session = this.sessions[sessionId];
    if (session === null) {
      return;
    }

    // Confirm that the client sending the action is up to date with the latest actions
    const clientAck = session.clientAcks[clientId];

    // If the client is not up to date, reject the action
    if (clientAck < session.actions.length - 1) {
      this.rejectClientAction(clientId, actionId);
      return;
    }

    // Otherwise, accept the action
    this.acceptClientAction(clientId, actionId, ops, sessionId);
  }

  /**
   * Updates all clients in a session, sending each of them any actions they haven't ack'd yet
   */
  updateClientsWithLatestActions(sessionId: SessionId) {
    const session = this.sessions[sessionId];
    if (session === null) {
      return;
    }

    if (session.actions.length === 0) {
      return;
    }

    const latestAck = session.actions[session.actions.length - 1].index;

    Object.keys(session.clientAcks).forEach((clientId) => {
      const clientAck = session.clientAcks[clientId];

      if (clientAck >= latestAck) {
        // Client is up to date, do nothing
        return;
      }

      // Send all un-acknowledged actions to the client
      const serverActionMessage: ServerActionMessage = {
        type: ServerMessageType.SERVER_ACTION,
        payload: {
          actions: session.actions.filter((action) => action.index > clientAck),
          isBroadcast: false,
        },
      };

      this.sendMessageToClient(clientId, serverActionMessage);
    });
  }

  handleClientAck(socketId: SocketId, ackIndex: number): void {
    const session = this.lookup.socketIdToSession(socketId);
    if (session === null) {
      return;
    }

    const clientId = this.lookup.socketIdToClientId(socketId);
    if (clientId === null) {
      return;
    }

    if (!(clientId in session.clientAcks)) {
      return;
    }

    // Update the ack index for the client
    session.clientAcks[clientId] = ackIndex;
  }
}

export default SessionManager;
