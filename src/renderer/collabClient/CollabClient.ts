import { Action } from 'renderer/store/action';
import { Op, OpPayload } from 'renderer/store/undoStack/helpers';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { ActionId, SessionCode } from 'collabTypes/collabShadowTypes';
import { sleep } from '../../sharedUtils';
import {
  ClientBroadcastPayload,
  ClientMessage,
  ClientMessageType,
} from '../../collabTypes/collabSharedTypes';
import store from '../store/store';
import { CLIENT_TO_SERVER_DELAY_SIMULATED, COLLAB_HOST } from './config';
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
    if (this.socket === null) {
      this.socket = io(COLLAB_HOST);
    }
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
  }

  registerHandlers() {
    if (this.socket === null) {
      return;
    }
    registerClientCollabHandlers(this.socket, this);
  }

  sendOp(op: Op<OpPayload, OpPayload>): ActionId {
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

  async sendMessage(message: ClientMessage): Promise<void> {
    if (this.socket === null) {
      return;
    }

    // Simulate sleep if enabled
    if (CLIENT_TO_SERVER_DELAY_SIMULATED > 0) {
      await sleep(CLIENT_TO_SERVER_DELAY_SIMULATED);
    }

    // Send the specified message
    this.socket.emit(message.type, message.payload);
  }

  sendBroadcast(payload: ClientBroadcastPayload): void {
    this.sendMessage({ type: ClientMessageType.CLIENT_BROADCAST, payload });
  }

  dispatchToStore: (action: Action<any>) => void = (action) => {
    store.dispatch(action);
  };

  getClientName(): string | null {
    return this.clientName;
  }
}

export default CollabClient;
