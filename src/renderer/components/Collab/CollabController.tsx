import { Button } from '@mui/material';
import { useState, useCallback } from 'react';
import CollabClient from '../../collabClient/CollabClient';

const CollabController = () => {
  const [collabClient, setCollabClient] = useState<CollabClient | null>(null);

  const startCollabSession = useCallback(() => {
    if (collabClient !== null) {
      return;
    }

    setCollabClient(new CollabClient());
  }, [collabClient, setCollabClient]);

  return <Button onClick={startCollabSession}>Start Collab Session</Button>;
};

export default CollabController;
