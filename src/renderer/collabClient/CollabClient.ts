import { Action } from 'renderer/store/action';
import { Op } from 'renderer/store/undoStack/helpers';
import { DoPayload, UndoPayload } from 'renderer/store/undoStack/opPayloads';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionId,
  ClientMessage,
  ClientMessageType,
  SessionCode,
} from '../../collabSharedTypes';
import store from '../store/store';
import { COLLAB_HOST } from './config';
import registerClientCollabHandlers from './handlerRegistration';
import ICollabClient from './ICollabClient';

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
    registerClientCollabHandlers(this.socket, this);
  }

  sendOp(op: Op<DoPayload, UndoPayload>): ActionId {
    const actionId: ActionId = uuidv4();

    const message: ClientMessage = {
      type: ClientMessageType.CLIENT_ACTION,
      payload: {
        id: actionId,
        ops: [op],
      },
    };

    this.sendMessage(message);

    return actionId;
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
