import {
  Client,
  ClientId,
  ServerAction,
  SessionCode,
  SessionId,
} from 'collabSharedTypes';
import { UndoStack } from 'renderer/store/undoStack/helpers';
import { Transcription } from 'sharedTypes';
import { Socket } from 'socket.io';

export type SocketId = string;

export interface CollabServerSessionState {
  id: SessionId;
  code: SessionCode;
  actions: ServerAction[];
  clientAcks: Record<ClientId, number>;
  clients: Client[];
  host: ClientId;
  sockets: Record<ClientId, Socket>;

  // Used for onboarding new clients.
  // Current state of transcription = initial state + initial undo stack + applied server actions
  initialTranscription: Transcription;
  initialUndoStack: UndoStack;
  mediaFileName: string;
}
