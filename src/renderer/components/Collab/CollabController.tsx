import { Button } from '@mui/material';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import CollabClient from '../../collabClient/CollabClient';

const CollabController = () => {
  const collab = useSelector((store: ApplicationStore) => store.collab);

  const [collabClient, setCollabClient] = useState<CollabClient | null>(null);

  const startCollabSession = useCallback(() => {
    if (collabClient !== null) {
      return;
    }

    setCollabClient(new CollabClient());
  }, [collabClient, setCollabClient]);

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
