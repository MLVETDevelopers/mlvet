import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollabClient from 'renderer/collabClient/CollabClient';
import { collabClientInstantiated } from 'renderer/store/collab/actions';
import { ApplicationStore } from 'renderer/store/sharedHelpers';

const CollabGuestJoin = () => {
  const [clientName, setClientName] = useState<string>('Guest');
  const [sessionCode, setSessionCode] = useState<string>('ABCDEF');

  const dispatch = useDispatch();

  const collab = useSelector((store: ApplicationStore) => store.collab);

  const joinCollabSession = useCallback(() => {
    // Init the client if it isn't already initialised
    const hasClient = collab !== null;
    const collabClient = hasClient ? collab.collabClient : new CollabClient();
    if (!hasClient) {
      dispatch(collabClientInstantiated(collabClient));
    }

    collabClient.joinSession(clientName, sessionCode);
  }, [clientName, sessionCode, collab, dispatch]);

  if (collab === null) {
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
        <Button onClick={joinCollabSession}>Join collab session</Button>
      </div>
    );
  }

  if (collab.sessionCode === null) {
    return <div>Joining collab session...</div>;
  }

  return null;
};

export default CollabGuestJoin;
