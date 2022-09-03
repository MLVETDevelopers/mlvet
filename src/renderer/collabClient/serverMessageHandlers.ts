import { ServerMessageType } from 'collabSharedTypes';
import ackClientActionHandler from './handlers/ackClientMessageHandler';
import ackInitSessionHandler from './handlers/ackInitSessionHandler';
import ackJoinSessionHandler from './handlers/ackJoinSessionHandler';
import guestJoinedHandler from './handlers/guestJoinedHandler';
import guestLeftHandler from './handlers/guestLeftHandler';
import serverActionHandler from './handlers/serverActionHandler';
import sessionEndedHandler from './handlers/sessionEndedHandler';
import { ServerMessageHandler } from './types';

const serverMessageHandlers: Record<ServerMessageType, ServerMessageHandler> = {
  [ServerMessageType.ACK_INIT_SESSION]: ackInitSessionHandler,
  [ServerMessageType.ACK_JOIN_SESSION]: ackJoinSessionHandler,
  [ServerMessageType.SESSION_ENDED]: sessionEndedHandler,
  [ServerMessageType.GUEST_JOINED]: guestJoinedHandler,
  [ServerMessageType.GUEST_LEFT]: guestLeftHandler,
  [ServerMessageType.SERVER_ACTION]: serverActionHandler,
  [ServerMessageType.ACK_CLIENT_ACTION]: ackClientActionHandler,
};

export default serverMessageHandlers;
