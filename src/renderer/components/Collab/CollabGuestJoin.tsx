import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import CollabClientManager from '../../collabClient/CollabClientManager';

const CollabGuestJoin = () => {
  const [clientName, setClientName] = useState<string>('Guest');
  const [sessionCode, setSessionCode] = useState<string>('ABCDEF');

  const joinCollabSession = useCallback(() => {
    // Init the client if it isn't already initialised
    const collabClient = CollabClientManager.getClient();

    collabClient.joinSession(clientName, sessionCode);
  }, [clientName, sessionCode]);

  return (
    <div>
      <TextField
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Your name"
      />
      <TextField
        value={sessionCode}
        onChange={(e) => setSessionCode(e.target.value)}
        placeholder="Session code"
      />
      <Button onClick={joinCollabSession}>Join a collab session</Button>
    </div>
  );
};

export default CollabGuestJoin;
