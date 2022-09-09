import { ClientId, SessionCode } from 'collabTypes/collabShadowTypes';
import { Client } from 'collabTypes/collabSharedTypes';
import ICollabClient from 'renderer/collabClient/ICollabClient';

export interface CollabClientInitialState {
  sessionCode: null;
  collabClient: ICollabClient;
}

export interface CollabClientSessionState {
  sessionCode: SessionCode;
  isHost: boolean;
  clients: Client[];
  ownClientId: ClientId;
  collabClient: ICollabClient;
}
