import MockedSocket from 'socket.io-mock';
import { ClientId, SessionCode } from 'collabSharedTypes';
import { Socket } from 'socket.io-client';
import { Transcription } from 'sharedTypes';
import { UndoStack } from 'renderer/store/undoStack/helpers';
import SessionManager from '../SessionManager';

const initFakeSession: (sessionManager: SessionManager) => {
  hostId: ClientId;
  sessionCode: SessionCode;
  mockedSocket: Socket;
  clientName: string;
  transcription: Transcription;
  undoStack: UndoStack;
  mediaFileName: string;
  socketSpy: jest.SpyInstance;
} = (sessionManager) => {
  const mockedSocket = new MockedSocket();
  const socketSpy = jest.spyOn(mockedSocket, 'emit');

  const clientName = 'Test client';
  const transcription = {
    duration: 0,
    outputDuration: 0,
    takeGroups: [],
    words: [],
  };
  const undoStack = {
    index: 0,
    stack: [],
  };
  const mediaFileName = 'test.mp4';

  const { hostId, sessionCode } = sessionManager.initSession({
    clientName,
    mediaFileName,
    socket: mockedSocket,
    transcription,
    undoStack,
  });

  return {
    hostId,
    sessionCode,
    mockedSocket,
    clientName,
    transcription,
    undoStack,
    mediaFileName,
    socketSpy,
  };
};

describe('SessionManager', () => {
  it('should have no sessions on initialisation', () => {
    const sessionManager = new SessionManager();

    expect(sessionManager.sessions).toEqual({});
  });

  it('should handle initialisation of a session', () => {
    const sessionManager = new SessionManager();

    const {
      clientName,
      hostId,
      mediaFileName,
      mockedSocket,
      sessionCode,
      transcription,
      undoStack,
    } = initFakeSession(sessionManager);

    // Expect one session to be in the sessions map
    expect(Object.keys(sessionManager.sessions).length).toBe(1);

    // Expect the session ID to be the key in the sessions map
    const session = sessionManager.lookup.findSessionByCode(sessionCode);
    expect(session).not.toBeNull();
    expect(Object.keys(sessionManager.sessions)).toEqual([session?.id]);

    // Expect various data to be on the session
    expect(session).toEqual({
      sockets: {
        [hostId]: mockedSocket,
      },
      actions: [],
      clientAcks: { [hostId]: -1 },
      clients: [{ id: hostId, name: clientName }],
      code: sessionCode,
      host: hostId,
      id: session?.id,
      initialTranscription: transcription,
      initialUndoStack: undoStack,
      mediaFileName,
    });
  });

  it('should handle initialisation of a session followed by a guest joining', () => {
    const sessionManager = new SessionManager();

    const {
      clientName: hostName,
      hostId,
      mockedSocket: hostSocket,
      mediaFileName,
      sessionCode,
      transcription,
      undoStack,
    } = initFakeSession(sessionManager);

    const guestClientName = 'Guest';
    const guestSocket = new MockedSocket();

    const {
      clientId: guestId,
      mediaFileName: mediaFileName2,
      otherClients,
      transcription: transcription2,
      undoStack: undoStack2,
    } = sessionManager.joinSession({
      clientName: guestClientName,
      sessionCode,
      socket: guestSocket,
    });

    // Expect certain values to match initial state
    expect(mediaFileName).toBe(mediaFileName2);
    expect(transcription).toBe(transcription2);
    expect(undoStack).toBe(undoStack2);

    // Expect the other clients to include the host
    expect(otherClients).toEqual([{ id: hostId, name: hostName }]);

    // Expect various data to now be on the session
    const session = sessionManager.lookup.findSessionByCode(sessionCode);
    expect(session).toEqual({
      sockets: {
        [hostId]: hostSocket,
        [guestId]: guestSocket,
      },
      actions: [],
      clientAcks: { [hostId]: -1, [guestId]: -1 },
      clients: [
        { id: hostId, name: hostName },
        { id: guestId, name: guestClientName },
      ],
      code: sessionCode,
      host: hostId,
      id: session?.id,
      initialTranscription: transcription,
      initialUndoStack: undoStack,
      mediaFileName,
    });
  });

  it('should handle a guest joining and then leaving', () => {
    const sessionManager = new SessionManager();

    const {
      clientName: hostName,
      hostId,
      mockedSocket: hostSocket,
      mediaFileName,
      sessionCode,
      transcription,
      undoStack,
    } = initFakeSession(sessionManager);

    const guestClientName = 'Guest';
    const guestSocket = new MockedSocket();

    const { clientId: guestId } = sessionManager.joinSession({
      clientName: guestClientName,
      sessionCode,
      socket: guestSocket,
    });

    const session = sessionManager.lookup.findSessionByCode(sessionCode);

    sessionManager.handleGuestLeaving(session?.id ?? '', guestId);

    // Expect various data to now be on the session
    expect(session).toEqual({
      sockets: {
        [hostId]: hostSocket,
      },
      actions: [],
      clientAcks: { [hostId]: -1 },
      clients: [{ id: hostId, name: hostName }],
      code: sessionCode,
      host: hostId,
      id: session?.id,
      initialTranscription: transcription,
      initialUndoStack: undoStack,
      mediaFileName,
    });
  });
});
