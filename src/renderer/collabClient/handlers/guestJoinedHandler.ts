import { GuestJoinedPayload } from 'collabSharedTypes';
import { collabGuestJoined } from 'renderer/store/collab/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const guestJoinedHandler: ServerMessageHandler = () => (payload) => {
  const { client } = payload as GuestJoinedPayload;

  const { dispatch } = store;

  dispatch(collabGuestJoined(client));
};

export default guestJoinedHandler;
