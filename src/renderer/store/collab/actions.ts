import { ClientId, SessionCode } from 'collabTypes/collabShadowTypes';
import { Client } from 'collabTypes/collabSharedTypes';
import ICollabClient from 'renderer/collabClient/ICollabClient';
import { CollabClientSessionState } from 'renderer/collabClient/types';
import { Action } from '../action';

export const COLLAB_CLIENT_INSTANTIATED = 'COLLAB_CLIENT_INSTANTIATED';

export const COLLAB_SESSION_STARTED = 'COLLAB_SESSION_STARTED';

export const COLLAB_SESSION_JOINED = 'COLLAB_SESSION_JOINED';

export const COLLAB_SESSION_ENDED = 'COLLAB_SESSION_ENDED';

export const COLLAB_GUEST_JOINED = 'COLLAB_GUEST_JOINED';

export const COLLAB_GUEST_LEFT = 'COLLAB_GUEST_LEFT';

export interface CollabClientInstantiatedPayload {
  collabClient: ICollabClient;
}

export type CollabSessionStartedPayload = Pick<
  CollabClientSessionState,
  'sessionCode' | 'clients' | 'ownClientId'
>;

export type CollabSessionJoinedPayload = CollabSessionStartedPayload;

export interface CollabGuestJoinedPayload {
  client: Client;
}

export interface CollabGuestLeftPayload {
  clientId: ClientId;
}

export const collabClientInstantiated: (
  collabClient: ICollabClient
) => Action<CollabClientInstantiatedPayload> = (collabClient) => ({
  type: COLLAB_CLIENT_INSTANTIATED,
  payload: {
    collabClient,
  },
});

export const collabSessionStarted: (
  sessionCode: SessionCode,
  clients: Client[],
  ownClientId: ClientId
) => Action<CollabSessionStartedPayload> = (
  sessionCode,
  clients,
  ownClientId
) => ({
  type: COLLAB_SESSION_STARTED,
  payload: {
    sessionCode,
    clients,
    ownClientId,
  },
});

export const collabSessionJoined: (
  sessionCode: SessionCode,
  clients: Client[],
  ownClientId: ClientId
) => Action<CollabSessionJoinedPayload> = (
  sessionCode,
  clients,
  ownClientId
) => ({
  type: COLLAB_SESSION_JOINED,
  payload: {
    sessionCode,
    clients,
    ownClientId,
  },
});

export const collabSessionEnded: () => Action<null> = () => ({
  type: COLLAB_SESSION_ENDED,
  payload: null,
});

export const collabGuestJoined: (
  client: Client
) => Action<CollabGuestJoinedPayload> = (client) => ({
  type: COLLAB_GUEST_JOINED,
  payload: {
    client,
  },
});

export const collabGuestLeft: (
  clientId: ClientId
) => Action<CollabGuestLeftPayload> = (clientId) => ({
  type: COLLAB_GUEST_LEFT,
  payload: {
    clientId,
  },
});
