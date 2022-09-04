import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollabClient from 'renderer/collabClient/CollabClient';
import { collabClientInstantiated } from 'renderer/store/collab/actions';
import { ApplicationStore } from 'renderer/store/sharedHelpers';

const CollabController = () => {
  const [clientName, setClientName] = useState<string>('Host');

  const dispatch = useDispatch();

  const collab = useSelector((store: ApplicationStore) => store.collab);

  const startCollabSession = useCallback(() => {
    const collabClient = new CollabClient();

    dispatch(collabClientInstantiated(collabClient));

    collabClient.initSession(clientName);
  }, [clientName, dispatch]);

  if (collab === null) {
    return (
      <div>
        <TextField
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Your name"
        />
        <Button onClick={startCollabSession}>Start Collab Session</Button>;
      </div>
    );
  }

  if (collab.sessionCode === null) {
    return <div>Collab session starting...</div>;
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
            <div key={client.id}>{client.name}</div>
          ))}
      </div>
    </div>
  );
};

export default CollabController;
