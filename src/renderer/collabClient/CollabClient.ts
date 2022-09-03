import { ClientMessage, ClientMessageType } from 'collabSharedTypes';
import { io, Socket } from 'socket.io-client';
import store from '../store/store';

const COLLAB_HOST = 'ws://localhost:5151';

class CollabClient {
  socket: Socket;

  constructor() {
    this.socket = io(COLLAB_HOST);

    this.initSession();
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
        clientName: 'Test',
        mediaFileName: 'test.mp4',
        transcription,
        undoStack,
      },
    });

    console.log(`Collab session initiated`);
  }

  sendMessage(message: ClientMessage): void {
    // Send the specified message
    this.socket.emit(message.type, message.payload);
  }

  onDismount() {
    // TODO(chloe): send end session or leave session message,
    // depending on whether or not the client is the host
    this.socket.close();
  }
}

export default CollabClient;
