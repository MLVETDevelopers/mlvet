import { ServerMessageType } from 'collabTypes/collabSharedTypes';
import ackClientActionHandler from './handlers/ackClientActionHandler';
import ackInitSessionHandler from './handlers/ackInitSessionHandler';
import ackJoinSessionHandler from './handlers/ackJoinSessionHandler';
import guestJoinedHandler from './handlers/guestJoinedHandler';
import guestLeftHandler from './handlers/guestLeftHandler';
import serverActionHandler from './handlers/serverActionHandler';
import serverBroadcastHandler from './handlers/serverBroadcastHandler';
import { ServerMessageHandler } from './types';

const serverMessageHandlers: Record<ServerMessageType, ServerMessageHandler> = {
  [ServerMessageType.ACK_INIT_SESSION]: ackInitSessionHandler,
  [ServerMessageType.ACK_JOIN_SESSION]: ackJoinSessionHandler,
  [ServerMessageType.GUEST_JOINED]: guestJoinedHandler,
  [ServerMessageType.GUEST_LEFT]: guestLeftHandler,
  [ServerMessageType.SERVER_ACTION]: serverActionHandler,
  [ServerMessageType.SERVER_BROADCAST]: serverBroadcastHandler,
  [ServerMessageType.ACK_CLIENT_ACTION]: ackClientActionHandler,
};

export default serverMessageHandlers;
