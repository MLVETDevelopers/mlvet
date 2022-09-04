import { AckInitSessionPayload, Client } from 'collabSharedTypes';
import { collabSessionStarted } from 'renderer/store/collab/actions';
import { ServerMessageHandler } from '../types';

const ackInitSessionHandler: ServerMessageHandler = (client) => (payload) => {
  console.log(client, payload);
  const { clientId, sessionCode } = payload as AckInitSessionPayload;

  const clientName = client.getClientName();

  if (clientName === null) {
    return;
  }

  const ownClientData: Client = {
    id: clientId,
    name: clientName,
  };

  client.dispatchToStore(
    collabSessionStarted(sessionCode, [ownClientData], clientId)
  );
};

export default ackInitSessionHandler;
