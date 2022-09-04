import MockedSocket from 'socket.io-mock';
import { ClientId, ServerMessageType, SessionCode } from 'collabSharedTypes';
import { Socket } from 'socket.io-client';
import { Transcription } from 'sharedTypes';
import { UndoStack } from 'renderer/store/undoStack/helpers';
import { CollabServerSessionState } from 'collabServer/types';
import { rangeLengthOne } from 'renderer/utils/range';
import { makeDeleteSelection } from 'renderer/store/transcriptionWords/ops/deleteSelection';
import SessionManager from '../SessionManager';

const initFakeSession: (sessionManager: SessionManager) => {
  hostId: ClientId;
  sessionCode: SessionCode;
  mockedSocket: Socket;
  clientName: string;
  transcription: Transcription;
  undoStack: UndoStack;
  mediaFileName: string;
  hostSocketSpy: jest.SpyInstance;
} = (sessionManager) => {
  const hostSocket = new MockedSocket();
  const hostSocketSpy = jest.spyOn(hostSocket, 'emit');

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
    socket: hostSocket,
    transcription,
    undoStack,
  });

  return {
    hostId,
    sessionCode,
    mockedSocket: hostSocket,
    hostSocketSpy,
    clientName,
    transcription,
    undoStack,
    mediaFileName,
  };
};

const initFakeSessionWithGuest: () => {
  session: CollabServerSessionState;
  sessionManager: SessionManager;
  hostId: ClientId;
  hostSocketSpy: jest.SpyInstance;
  guestId: ClientId;
  guestSocketSpy: jest.SpyInstance;
} = () => {
  const sessionManager = new SessionManager();

  const { sessionCode, hostId, hostSocketSpy } =
    initFakeSession(sessionManager);

  const guestClientName = 'Guest';
  const guestSocket = new MockedSocket();
  const guestSocketSpy = jest.spyOn(guestSocket, 'emit');

  const { clientId: guestId } = sessionManager.joinSession({
    clientName: guestClientName,
    sessionCode,
    socket: guestSocket,
  });

  const session = sessionManager.lookup.findSessionByCode(sessionCode);

  return {
    session: session as CollabServerSessionState,
    sessionManager,
    guestId,
    guestSocketSpy,
    hostId,
    hostSocketSpy,
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

  it('should handle a client action being accepted', () => {
    const { session, sessionManager, guestId, guestSocketSpy } =
      initFakeSessionWithGuest();

    expect(guestSocketSpy).toBeCalledTimes(0);

    const actionId = 'abc';
    const ops = [makeDeleteSelection([rangeLengthOne(0)])];

    sessionManager.handleClientAction(actionId, ops, guestId, session.id);

    expect(guestSocketSpy).toBeCalledTimes(1);
    expect(guestSocketSpy).toBeCalledWith(ServerMessageType.ACK_CLIENT_ACTION, {
      id: actionId,
      isAccepted: true,
    });
  });

  it('should inform other clients after an action is accepted', () => {
    const { session, sessionManager, guestId, hostSocketSpy } =
      initFakeSessionWithGuest();

    expect(hostSocketSpy).toBeCalledTimes(0);

    const actionId = 'abc';
    const ops = [makeDeleteSelection([rangeLengthOne(0)])];

    sessionManager.handleClientAction(actionId, ops, guestId, session.id);

    expect(hostSocketSpy).toBeCalledTimes(1);
    expect(hostSocketSpy).toBeCalledWith(ServerMessageType.SERVER_ACTION, {
      actions: [
        {
          clientId: guestId,
          id: actionId,
          index: 0,
          ops,
        },
      ],
    });
  });

  it('should handle a client action being rejected due to client being out of date', () => {
    const { session, sessionManager, guestId, guestSocketSpy } =
      initFakeSessionWithGuest();

    // Push an action to the actions list that the client doesn't know about
    session.actions.push({
      clientId: 'def',
      id: 'ghi',
      index: 0,
      ops: [],
    });

    const actionId = 'abc';
    const ops = [makeDeleteSelection([rangeLengthOne(0)])];

    expect(guestSocketSpy).toBeCalledTimes(0);

    sessionManager.handleClientAction(actionId, ops, guestId, session.id);

    expect(guestSocketSpy).toBeCalledTimes(1);
    expect(guestSocketSpy).toBeCalledWith(ServerMessageType.ACK_CLIENT_ACTION, {
      id: actionId,
      isAccepted: false,
    });
  });

  it('should handle two client actions arriving sequentially with no acks between', () => {
    const { session, sessionManager, guestId, hostId, hostSocketSpy } =
      initFakeSessionWithGuest();

    expect(hostSocketSpy).toBeCalledTimes(0);

    const firstActionId = 'abc';
    const secondActionId = 'def';
    const ops = [makeDeleteSelection([rangeLengthOne(0)])];

    // Guest pushes an action, it gets accepted
    sessionManager.handleClientAction(firstActionId, ops, guestId, session.id);

    // Host pushes an action, it gets rejected as the host doesn't know about the guest's latest action
    sessionManager.handleClientAction(secondActionId, ops, hostId, session.id);

    expect(hostSocketSpy).toBeCalledTimes(2);

    // First call should be notification of the guest's action
    expect(hostSocketSpy.mock.calls[0][0]).toEqual(
      ServerMessageType.SERVER_ACTION
    );
    expect(hostSocketSpy.mock.calls[0][1]).toEqual({
      actions: [
        {
          clientId: guestId,
          id: firstActionId,
          index: 0,
          ops,
        },
      ],
    });

    // Second call should be rejection of the host's action
    expect(hostSocketSpy.mock.calls[1][0]).toEqual(
      ServerMessageType.ACK_CLIENT_ACTION
    );
    expect(hostSocketSpy.mock.calls[1][1]).toEqual({
      id: secondActionId,
      isAccepted: false,
    });
  });

  it('should handle two client actions arriving sequentially with an ack between', () => {});

  it('should handle two sessions being managed at once', () => {});
});
