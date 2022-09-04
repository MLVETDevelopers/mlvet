import { Reducer } from 'redux';
import { CollabClientSessionState } from 'renderer/collabClient/types';
import {
  COLLAB_SESSION_STARTED,
  COLLAB_SESSION_JOINED,
  COLLAB_SESSION_ENDED,
  CollabSessionStartedPayload,
  CollabSessionJoinedPayload,
  COLLAB_GUEST_JOINED,
  CollabGuestJoinedPayload,
  CollabGuestLeftPayload,
  COLLAB_GUEST_LEFT,
  COLLAB_CLIENT_INSTANTIATED,
  CollabClientInstantiatedPayload,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const collabReducer: Reducer<ApplicationStore['collab'], Action<any>> = (
  collab = initialStore.collab,
  action
) => {
  if (action.type === COLLAB_CLIENT_INSTANTIATED) {
    const { collabClient } = action.payload as CollabClientInstantiatedPayload;

    return { collabClient, sessionCode: null };
  }

  if (action.type === COLLAB_SESSION_STARTED) {
    const { sessionCode, clients, ownClientId } =
      action.payload as CollabSessionStartedPayload;

    if (collab === null) {
      return collab;
    }

    return {
      sessionCode,
      clients,
      ownClientId,
      isHost: true,
      collabClient: collab.collabClient,
    };
  }

  if (action.type === COLLAB_SESSION_JOINED) {
    const { sessionCode, clients, ownClientId } =
      action.payload as CollabSessionJoinedPayload;

    return {
      sessionCode,
      clients,
      ownClientId,
      isHost: false,
      collabClient: collab?.collabClient,
    } as CollabClientSessionState;
  }

  if (action.type === COLLAB_SESSION_ENDED) {
    return null;
  }

  if (action.type === COLLAB_GUEST_JOINED) {
    const { client } = action.payload as CollabGuestJoinedPayload;

    if (collab === null || collab.sessionCode === null) {
      return collab;
    }

    return {
      ...collab,
      clients: collab.clients.concat([client]),
    } as CollabClientSessionState;
  }

  if (action.type === COLLAB_GUEST_LEFT) {
    const { clientId } = action.payload as CollabGuestLeftPayload;

    if (collab === null || collab.sessionCode === null) {
      return collab;
    }

    return {
      ...collab,
      clients: collab.clients.filter((client) => client.id !== clientId),
    } as CollabClientSessionState;
  }

  return collab;
};

export default collabReducer;
