import {
  ClientMessage,
  ClientMessageType,
  ServerMessageType,
} from 'collabSharedTypes';
import { Action } from 'renderer/store/action';
import { io, Socket } from 'socket.io-client';
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
  socket: Socket;

  name: string;

  constructor() {
    this.socket = io(COLLAB_HOST);

    this.initSession();

    this.registerHandlers();

    this.name = 'Test';
  }

  initSession(): void {
    const state = store.getState();
    const transcription = state.currentProject?.transcription ?? null;
    const { undoStack } = state;

    if (transcription === null) {
      return;
    }

    this.sendMessage({
      type: ClientMessageType.INIT_SESSION,
      payload: {
        clientName: this.getClientName(),
        mediaFileName: 'test.mp4',
        transcription,
        undoStack,
      },
    });

    console.log(`Collab session initiated`);
  }

  registerHandlers() {
    Object.keys(serverMessageHandlers).forEach((eventKey) => {
      const serverMessageType = eventKey as ServerMessageType;
      const handler = serverMessageHandlers[serverMessageType](this);

      this.socket.on(eventKey, wrapHandler(handler, serverMessageType));
    });

    this.socket.on('disconnect', disconnectHandler(this));
  }

  sendMessage(message: ClientMessage): void {
    // Send the specified message
    this.socket.emit(message.type, message.payload);
  }

  dispatchToStore: (action: Action<any>) => void = (action) => {
    store.dispatch(action);
  };

  getClientName() {
    return this.name;
  }
}

export default CollabClient;
