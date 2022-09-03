import { ClientMessage } from 'collabSharedTypes';

interface ICollabClient {
  sendMessage: (message: ClientMessage) => void;
}

export default ICollabClient;
