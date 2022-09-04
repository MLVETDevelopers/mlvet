import { ClientMessage } from 'collabSharedTypes';
import { Action } from 'renderer/store/action';

interface ICollabClient {
  sendMessage: (message: ClientMessage) => void;

  dispatchToStore: (action: Action<any>) => void;

  getClientName: () => string | null;
}

export default ICollabClient;
