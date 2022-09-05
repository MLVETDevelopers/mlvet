import { SelectionPayload, UndoStack } from 'renderer/store/undoStack/helpers';
import { Transcription } from 'sharedTypes';
import { Socket } from 'socket.io';
import { Action } from 'renderer/store/action';
import { Client, ServerAction } from '../collabTypes/collabSharedTypes';
import {
  ClientId,
  SessionCode,
  SessionId,
} from '../collabTypes/collabShadowTypes';

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

export type BroadcastableAction = Action<SelectionPayload>;
