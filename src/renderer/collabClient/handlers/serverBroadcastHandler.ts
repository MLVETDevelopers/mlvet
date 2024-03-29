import { ServerBroadcastPayload } from 'collabTypes/collabSharedTypes';
import { Action } from 'renderer/store/action';
import {
  SelectionRangeSetToPayload,
  SELECTION_RANGE_SET_TO,
} from 'renderer/store/selection/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const serverBroadcastHandler: ServerMessageHandler = () => (payload) => {
  const { action, clientId } = payload as ServerBroadcastPayload;

  const { dispatch } = store;

  // Run the action directly
  // TODO: generic handling
  if (action.type === SELECTION_RANGE_SET_TO) {
    const newAction: Action<SelectionRangeSetToPayload> = {
      ...action,
      payload: {
        ...(action.payload as SelectionRangeSetToPayload),
        clientId,
      },
    };

    dispatch(newAction);
  }
};

export default serverBroadcastHandler;
