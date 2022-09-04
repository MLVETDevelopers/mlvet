import { GuestLeftPayload } from 'collabSharedTypes';
import { collabGuestLeft } from 'renderer/store/collab/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const guestLeftHandler: ServerMessageHandler = () => (payload) => {
  const { clientId } = payload as GuestLeftPayload;

  const { dispatch } = store;

  dispatch(collabGuestLeft(clientId));
};

export default guestLeftHandler;
