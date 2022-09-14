import {
  ActionId,
  ClientId,
  DisconnectReason,
  SessionCode,
} from 'collabTypes/collabShadowTypes';
import { Action } from 'renderer/store/action';
import {
  Op,
  UndoStack,
  OpPayload,
  SelectionPayload,
} from 'renderer/store/undoStack/helpers';
import { Transcription } from 'sharedTypes';

/** Misc */

export interface Client {
  name: string;
  id: ClientId;
}

export interface ErrorPayload {
  error: true;
  message: string | null;
}

export type BroadcastableAction = Action<SelectionPayload>;

/** Server actions */

export interface ServerAction {
  ops: Op<OpPayload, OpPayload>[];
  clientId: ClientId;
  index: number;
  id: ActionId;
}

/** Message types */

export enum ClientMessageType {
  INIT_SESSION = 'init-session',
  JOIN_SESSION = 'join-session',
  ACK_SERVER_ACTION = 'ack-server-action',
  CLIENT_ACTION = 'client-action',
  CLIENT_BROADCAST = 'client-broadcast',
}

export enum ServerMessageType {
  ACK_INIT_SESSION = 'ack-init-session',
  ACK_JOIN_SESSION = 'ack-join-session',
  GUEST_JOINED = 'guest-joined',
  GUEST_LEFT = 'guest-left',
  SERVER_ACTION = 'server-action',
  SERVER_BROADCAST = 'server-broadcast',
  ACK_CLIENT_ACTION = 'ack-client-action',
}

/** Types with potential mismatch between message type and payload */

interface ClientMessageBase<
  T extends ClientMessageType,
  U extends ClientMessagePayload
> {
  type: T;
  payload: U;
}

interface ServerMessageBase<
  T extends ServerMessageType,
  U extends ServerMessagePayload | ErrorPayload
> {
  type: T;
  payload: U;
}

/** Client message payloads */

export interface InitSessionPayload {
  transcription: Transcription;
  undoStack: UndoStack;
  clientName: string;
  mediaFileName: string;
}

export interface JoinSessionPayload {
  sessionCode: SessionCode;
  clientName: string;
}

export interface AckServerActionPayload {
  index: number; // index of the most recent action that was ack'd
}

export interface ClientActionPayload {
  id: ActionId; // UUID
  ops: Op<OpPayload, OpPayload>[];
}

export interface ClientBroadcastPayload {
  action: BroadcastableAction;
}

/** Server message payloads */

export interface AckInitSessionPayload {
  sessionCode: SessionCode;
  clientId: ClientId;
}

export interface AckJoinSessionPayload {
  transcription: Transcription;
  undoStack: UndoStack;
  otherClients: Client[];
  clientId: ClientId;
  mediaFileName: string;
  sessionCode: SessionCode;
  error: boolean;
  actions: ServerAction[];
}

export interface GuestJoinedPayload {
  client: Client;
}

export interface GuestLeftPayload {
  clientId: ClientId;
}

export interface ServerActionPayload {
  actions: ServerAction[];
}

export interface ServerBroadcastPayload {
  action: BroadcastableAction;
  clientId: ClientId;
}

export interface AckClientActionPayload {
  id: ActionId;
  isAccepted: boolean;
}

/** Client message types */

export type ClientMessagePayload =
  | InitSessionPayload
  | JoinSessionPayload
  | AckServerActionPayload
  | ClientActionPayload
  | ClientBroadcastPayload
  | DisconnectReason;

export type InitSessionMessage = ClientMessageBase<
  ClientMessageType.INIT_SESSION,
  InitSessionPayload
>;
export type JoinSessionMessage = ClientMessageBase<
  ClientMessageType.JOIN_SESSION,
  JoinSessionPayload
>;
export type AckServerActionMessage = ClientMessageBase<
  ClientMessageType.ACK_SERVER_ACTION,
  AckServerActionPayload
>;
export type ClientActionMessage = ClientMessageBase<
  ClientMessageType.CLIENT_ACTION,
  ClientActionPayload
>;
export type ClientBroadcastMessage = ClientMessageBase<
  ClientMessageType.CLIENT_BROADCAST,
  ClientBroadcastPayload
>;

// Slightly more refined type than ClientMessageBase,
// as it matches action types to their respective payloads
export type ClientMessage =
  | InitSessionMessage
  | JoinSessionMessage
  | AckServerActionMessage
  | ClientActionMessage
  | ClientBroadcastMessage;

/** Server message types */

export type ServerMessagePayload =
  | AckInitSessionPayload
  | AckJoinSessionPayload
  | GuestJoinedPayload
  | GuestLeftPayload
  | ServerActionPayload
  | ServerBroadcastPayload
  | AckClientActionPayload
  | DisconnectReason;

export type AckInitSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_INIT_SESSION,
  AckInitSessionPayload
>;
export type AckJoinSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_JOIN_SESSION,
  AckJoinSessionPayload | ErrorPayload
>;
export type GuestJoinedMessage = ServerMessageBase<
  ServerMessageType.GUEST_JOINED,
  GuestJoinedPayload
>;
export type GuestLeftMessage = ServerMessageBase<
  ServerMessageType.GUEST_LEFT,
  GuestLeftPayload
>;
export type ServerActionMessage = ServerMessageBase<
  ServerMessageType.SERVER_ACTION,
  ServerActionPayload
>;
export type ServerBroadcastMessage = ServerMessageBase<
  ServerMessageType.SERVER_BROADCAST,
  ServerBroadcastPayload
>;
export type AckClientActionMessage = ServerMessageBase<
  ServerMessageType.ACK_CLIENT_ACTION,
  AckClientActionPayload
>;

// Slightly more refined type than ServerMessageBase,
// as it matches action types to their respective payloads
export type ServerMessage =
  | AckInitSessionMessage
  | AckJoinSessionMessage
  | GuestJoinedMessage
  | GuestLeftMessage
  | ServerActionMessage
  | ServerBroadcastMessage
  | AckClientActionMessage;
