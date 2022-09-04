import { Button } from '@mui/material';
import { useCallback } from 'react';
import CollabClientManager from '../../collabClient/CollabClientManager';

const CollabGuestJoin = () => {
  const joinCollabSession = useCallback(() => {
    const clientName = window.prompt('Enter your name: ');
    const sessionCode = window.prompt('Enter the session code: ');

    if (clientName === null || sessionCode === null) {
      return;
    }

    // Init the client if it isn't already initialised
    const collabClient = CollabClientManager.getClient();

    collabClient.joinSession(clientName, sessionCode);
  }, []);

  return (
    <div>
      <Button onClick={joinCollabSession}>Join a collab session</Button>
    </div>
  );
};

export default CollabGuestJoin;
