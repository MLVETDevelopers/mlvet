import { ServerBroadcastPayload } from 'collabTypes/collabSharedTypes';
import { Action } from 'renderer/store/action';
import {
  SelectionIndicesSetToPayload,
  SELECTION_INDICES_SET_TO,
} from 'renderer/store/selection/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const serverActionHandler: ServerMessageHandler = () => (payload) => {
  const { action, clientId } = payload as ServerBroadcastPayload;

  const { dispatch } = store;

  // Run the action directly
  // TODO: generic handling
  if (action.type === SELECTION_INDICES_SET_TO) {
    const newAction: Action<SelectionIndicesSetToPayload> = {
      ...action,
      payload: {
        ...(action.payload as SelectionIndicesSetToPayload),
        clientId,
      },
    };

    dispatch(newAction);
  }
};

export default serverActionHandler;
