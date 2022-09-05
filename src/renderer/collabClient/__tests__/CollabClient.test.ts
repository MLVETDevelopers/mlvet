import MockedSocket from 'socket.io-mock';
import {
  AckInitSessionPayload,
  AckJoinSessionPayload,
  ClientMessageType,
} from 'collabTypes/collabSharedTypes';
import store from 'renderer/store/store';
import { projectCreated } from 'renderer/store/currentProject/actions';
import { Transcription } from 'sharedTypes';
import { collabClientInstantiated } from 'renderer/store/collab/actions';
import { CollabClientSessionState } from 'renderer/store/collab/helpers';
import { CURRENT_SCHEMA_VERSION } from '../../../constants';
import ackInitSessionHandler from '../handlers/ackInitSessionHandler';
import ackJoinSessionHandler from '../handlers/ackJoinSessionHandler';
import CollabClient from '../CollabClient';

const { dispatch } = store;

const emptyTranscription: Transcription = {
  duration: 0,
  outputDuration: 0,
  takeGroups: [],
  words: [],
};

const initProject: () => void = () => {
  dispatch(
    projectCreated({
      id: 'abc',
      isEdited: false,
      mediaFileExtension: 'mp4',
      mediaFilePath: 'test.mp4',
      mediaType: 'video',
      name: 'test project',
      projectFilePath: 'project.mlvet',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      transcription: emptyTranscription,
    })
  );
};

describe('CollabClient', () => {
  it('should successfully initiate a session', () => {
    initProject();
    const client = new CollabClient();

    const socket = new MockedSocket();
    const socketSpy = jest.spyOn(socket, 'emit');

    client.socket = socket;

    const clientName = 'test host';

    client.initSession(clientName);

    expect(socketSpy).toBeCalledTimes(1);
    expect(socketSpy).toBeCalledWith(ClientMessageType.INIT_SESSION, {
      clientName,
      mediaFileName: 'test.mp4',
      transcription: emptyTranscription,
      undoStack: { stack: [], index: 0 },
    });
  });

  it('should update collab data after successfully initiating a session', () => {
    initProject();
    const client = new CollabClient();
    dispatch(collabClientInstantiated(client));

    const socket = new MockedSocket();
    client.socket = socket;
    const clientName = 'test host';
    client.initSession(clientName);

    const sessionCode = 'ABCDEF';
    const clientId = 'xyz';

    ackInitSessionHandler(client)({
      clientId,
      sessionCode,
    } as AckInitSessionPayload);

    const collab = store.getState().collab as CollabClientSessionState;

    expect(collab.sessionCode).toBe(sessionCode);
    expect(collab.isHost).toBe(true);
    expect(collab.clients).toEqual([{ id: clientId, name: clientName }]);
    expect(collab.ownClientId).toBe(clientId);
  });

  it('should send a request to join an existing session', () => {
    const client = new CollabClient();

    const socket = new MockedSocket();
    const socketSpy = jest.spyOn(socket, 'emit');

    client.socket = socket;

    const clientName = 'test guest';
    const sessionCode = 'ABCDEF';

    client.joinSession(clientName, sessionCode);

    expect(socketSpy).toBeCalledTimes(1);
    expect(socketSpy).toBeCalledWith(ClientMessageType.JOIN_SESSION, {
      sessionCode,
      clientName,
    });
  });

  it('should update collab data after joining a valid session', () => {
    const client = new CollabClient();
    dispatch(collabClientInstantiated(client));

    const socket = new MockedSocket();
    client.socket = socket;

    const clientName = 'test guest';
    const sessionCode = 'ABCDEF';
    const clientId = 'uvw';

    client.joinSession(clientName, sessionCode);

    ackJoinSessionHandler(client)({
      actions: [],
      clientId,
      error: false,
      mediaFileName: 'test.mp4',
      otherClients: [{ id: 'xyz', name: 'Test host' }],
      sessionCode,
      transcription: emptyTranscription,
      undoStack: { stack: [], index: 0 },
    } as AckJoinSessionPayload);

    const collab = store.getState().collab as CollabClientSessionState;

    expect(collab.sessionCode).toBe(sessionCode);
    expect(collab.isHost).toBe(false);
    expect(collab.clients).toEqual([
      { id: 'xyz', name: 'Test host' },
      { id: clientId, name: clientName },
    ]);
    expect(collab.ownClientId).toBe(clientId);
  });
});
