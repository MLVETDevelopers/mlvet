import { AckJoinSessionPayload } from 'collabTypes/collabSharedTypes';
import { collabSessionJoined } from 'renderer/store/collab/actions';
import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import { projectCreated } from 'renderer/store/currentProject/actions';
import { undoStackSet } from 'renderer/store/undoStack/actions';
import store from 'renderer/store/store';
import { v4 as uuidv4 } from 'uuid';
import { ServerMessageHandler } from '../types';
import { CURRENT_SCHEMA_VERSION } from '../../../constants';
import serverActionHandler from './serverActionHandler';

const ackJoinSessionHandler: ServerMessageHandler = (client) => (payload) => {
  const {
    clientId,
    mediaFileName,
    otherClients,
    transcription,
    undoStack,
    sessionCode,
    error,
    actions,
  } = payload as AckJoinSessionPayload;
  if (error) {
    return;
  }

  const clientName = client.getClientName();

  if (clientName === null) {
    return;
  }

  const { dispatch } = store;

  dispatch(
    projectCreated({
      id: uuidv4(),
      isEdited: true,
      mediaFileExtension: 'mp4', // TODO
      mediaFilePath: mediaFileName, // TODO
      mediaType: 'video', // TODO
      name: 'Collab Project', // TODO
      projectFilePath: null,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      transcription,
    })
  );

  dispatch(pageChanged(ApplicationPage.PROJECT));

  const allClients = otherClients.concat([
    {
      id: clientId,
      name: clientName,
    },
  ]);

  dispatch(collabSessionJoined(sessionCode, allClients, clientId));

  dispatch(undoStackSet(undoStack.stack, undoStack.index));

  // Get the client up to date on all actions performed so far
  serverActionHandler(client)({ actions });
};

export default ackJoinSessionHandler;
