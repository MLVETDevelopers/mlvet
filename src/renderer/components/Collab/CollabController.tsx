import {
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollabClient from 'renderer/collabClient/CollabClient';
import colors from 'renderer/colors';
import { collabClientInstantiated } from 'renderer/store/collab/actions';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { getColourForIndex } from 'renderer/utils/ui';

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
        <Button onClick={startCollabSession}>Start Collab Session</Button>
      </div>
    );
  }

  if (collab.sessionCode === null) {
    return (
      <CircularProgress
        sx={{ color: colors.yellow[500], fontSize: 24, margin: '3px' }}
        size="23px"
        thickness={4}
      />
    );
  }

  return (
    <div>
      <div>Session code: {collab.sessionCode}</div>
      <div>
        {collab.clients
          .filter((client) => client.id !== collab.ownClientId)
          .map((client, index) => (
            <Tooltip key={client.id} title={client.name}>
              <Avatar
                key={client.id}
                sx={{
                  bgcolor: getColourForIndex(index),
                  display: 'inline-flex',
                  marginTop: '10px',
                  marginLeft: '10px',
                }}
                alt={client.name}
              >
                {client.name.slice(0, 1).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
      </div>
    </div>
  );
};

export default CollabController;
