import { Action } from 'renderer/store/action';
import { Op } from 'renderer/store/undoStack/helpers';
import { DoPayload, UndoPayload } from 'renderer/store/undoStack/opPayloads';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import {
  ClientMessage,
  ClientMessageType,
  ServerMessageType,
  SessionCode,
} from '../../collabSharedTypes';
import store from '../store/store';
import disconnectHandler from './handlers/disconnectHandler';
import ICollabClient from './ICollabClient';
import serverMessageHandlers from './serverMessageHandlers';
import { ServerMessageHandlerInner } from './types';

const COLLAB_HOST = 'ws://localhost:5151';
const LOG_VERBOSE = true;

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

class CollabClient implements ICollabClient {
  socket: Socket | null;

  clientName: string | null;

  constructor() {
    this.socket = null;
    this.clientName = null;
  }

  initSocket(): void {
    this.socket = io(COLLAB_HOST);
  }

  closeSocket(): void {
    if (this.socket === null) {
      return;
    }

    this.socket.close();
  }

  initSession(clientName: string): void {
    const state = store.getState();
    const transcription = state.currentProject?.transcription ?? null;
    const { undoStack } = state;

    if (transcription === null) {
      return;
    }

    this.initSocket();
    this.registerHandlers();

    this.clientName = clientName;

    this.sendMessage({
      type: ClientMessageType.INIT_SESSION,
      payload: {
        clientName,
        mediaFileName: 'test.mp4',
        transcription,
        undoStack,
      },
    });

    console.log(`Collab session initiated`);
  }

  joinSession(clientName: string, sessionCode: SessionCode): void {
    this.initSocket();
    this.registerHandlers();

    this.clientName = clientName;

    this.sendMessage({
      type: ClientMessageType.JOIN_SESSION,
      payload: {
        clientName,
        sessionCode,
      },
    });

    console.log(`Collab session joined`);
  }

  registerHandlers() {
    if (this.socket === null) {
      return;
    }

    Object.keys(serverMessageHandlers).forEach((eventKey) => {
      const serverMessageType = eventKey as ServerMessageType;
      const handler = serverMessageHandlers[serverMessageType](this);

      if (this.socket === null) {
        return;
      }

      this.socket.on(eventKey, wrapHandler(handler, serverMessageType));
    });

    this.socket.on('disconnect', disconnectHandler(this));
  }

  sendOp(op: Op<DoPayload, UndoPayload>): void {
    const message: ClientMessage = {
      type: ClientMessageType.CLIENT_ACTION,
      payload: {
        id: uuidv4(),
        ops: [op],
      },
    };

    this.sendMessage(message);
  }

  sendMessage(message: ClientMessage): void {
    if (this.socket === null) {
      return;
    }

    // Send the specified message
    this.socket.emit(message.type, message.payload);
  }

  dispatchToStore: (action: Action<any>) => void = (action) => {
    store.dispatch(action);
  };

  getClientName(): string | null {
    return this.clientName;
  }
}

export default CollabClient;
