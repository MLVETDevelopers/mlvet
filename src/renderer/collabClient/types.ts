import {
  Client,
  ClientId,
  ServerMessagePayload,
  SessionCode,
} from '../../collabSharedTypes';
import ICollabClient from './ICollabClient';

export type ServerMessageHandlerInner = (payload: ServerMessagePayload) => void;

export type ServerMessageHandler = (
  client: ICollabClient
) => ServerMessageHandlerInner;

export interface CollabClientSessionState {
  sessionCode: SessionCode;
  isHost: boolean;
  clients: Client[];
  ownClientId: ClientId;
}
