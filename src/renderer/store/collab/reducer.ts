import { Reducer } from 'redux';
import {
  COLLAB_SESSION_STARTED,
  COLLAB_SESSION_JOINED,
  COLLAB_SESSION_ENDED,
  CollabSessionStartedPayload,
  CollabSessionJoinedPayload,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const collabReducer: Reducer<ApplicationStore['collab'], Action<any>> = (
  collab = initialStore.collab,
  action
) => {
  if (action.type === COLLAB_SESSION_STARTED) {
    const { sessionCode, clients, ownClientId } =
      action.payload as CollabSessionStartedPayload;

    return {
      sessionCode,
      clients,
      ownClientId,
      isHost: true,
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
    };
  }

  if (action.type === COLLAB_SESSION_ENDED) {
    return null;
  }

  return collab;
};

export default collabReducer;
