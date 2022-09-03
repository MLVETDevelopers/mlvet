import { Client, ClientId, SessionCode } from 'collabSharedTypes';
import { CollabClientSessionState } from 'renderer/collabClient/types';
import { Action } from '../action';

export const COLLAB_SESSION_STARTED = 'COLLAB_SESSION_STARTED';

export const COLLAB_SESSION_JOINED = 'COLLAB_SESSION_JOINED';

export const COLLAB_SESSION_ENDED = 'COLLAB_SESSION_ENDED';

export type CollabSessionStartedPayload = Pick<
  CollabClientSessionState,
  'sessionCode' | 'clients' | 'ownClientId'
>;

export type CollabSessionJoinedPayload = CollabSessionStartedPayload;

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
