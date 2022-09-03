import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import CollabClientManager from '../../collabClient/CollabClientManager';

const CollabController = () => {
  const collab = useSelector((store: ApplicationStore) => store.collab);

  const startCollabSession = useCallback(() => {
    // Init the client if it isn't already initialised
    CollabClientManager.getClient();
  }, []);

  if (collab === null) {
    return <Button onClick={startCollabSession}>Start Collab Session</Button>;
  }

  return (
    <div>
      <div>Collab session code: {collab.sessionCode}</div>
      <div>{collab.isHost ? "You're the host" : 'Editing as a guest'}</div>
      <div>
        Other collaborators connected:
        {collab.clients
          .filter((client) => client.id !== collab.ownClientId)
          .map((client) => (
            <div>{client.name}</div>
          ))}
      </div>
    </div>
  );
};

export default CollabController;
