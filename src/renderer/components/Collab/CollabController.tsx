import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import CollabClientManager from '../../collabClient/CollabClientManager';

const CollabController = () => {
  const [clientName, setClientName] = useState<string>('Host');

  const collab = useSelector((store: ApplicationStore) => store.collab);

  const startCollabSession = useCallback(() => {
    // Init the client if it isn't already initialised
    const collabClient = CollabClientManager.getClient();

    collabClient.initSession(clientName);
  }, [clientName]);

  if (collab === null) {
    return <Button onClick={startCollabSession}>Start Collab Session</Button>;
  }

  return (
    <div>
      <TextField
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Your name"
      />
      <div>Collab session code: {collab.sessionCode}</div>
      <div>{collab.isHost ? "You're the host" : 'Editing as a guest'}</div>
      <div>
        Other collaborators connected:
        {collab.clients
          .filter((client) => client.id !== collab.ownClientId)
          .map((client) => (
            <div key={client.id}>{client.name}</div>
          ))}
      </div>
    </div>
  );
};

export default CollabController;
