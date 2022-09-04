import { Op, UndoStack } from 'renderer/store/undoStack/helpers';
import { DoPayload, UndoPayload } from 'renderer/store/undoStack/opPayloads';
import { Transcription } from 'sharedTypes';

/** Shadow types */

export type ActionId = string; // UUID

export type ClientId = string; // UUID

export type SessionId = string; // UUID

export type SessionCode = string; // six digit code

export type DisconnectReason = string;

/** Misc */

export interface Client {
  name: string;
  id: ClientId;
}

export interface ErrorPayload {
  error: true;
  message: string | null;
}

/** Server actions */

export interface ServerAction {
  ops: Op<DoPayload, UndoPayload>[];
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
}

export enum ServerMessageType {
  ACK_INIT_SESSION = 'ack-init-session',
  ACK_JOIN_SESSION = 'ack-join-session',
  SESSION_ENDED = 'session-ended',
  GUEST_JOINED = 'guest-joined',
  GUEST_LEFT = 'guest-left',
  SERVER_ACTION = 'server-action',
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
  ops: Op<DoPayload, UndoPayload>[];
}

/** Server message payloads */

export interface AckInitSessionPayload {
  sessionCode: SessionCode;
  clientId: ClientId;
}

export type AckEndSessionPayload = null;

export interface AckJoinSessionPayload {
  transcription: Transcription;
  undoStack: UndoStack;
  otherClients: Client[];
  clientId: ClientId;
  mediaFileName: string;
  sessionCode: SessionCode;
  error: boolean;
}

export type AckLeaveSessionPayload = null;

export type SessionEndedPayload = null;

export interface GuestJoinedPayload {
  client: Client;
}

export interface GuestLeftPayload {
  clientId: ClientId;
}

export interface ServerActionPayload {
  actions: ServerAction[];
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
  | DisconnectReason;

type InitSessionMessage = ClientMessageBase<
  ClientMessageType.INIT_SESSION,
  InitSessionPayload
>;
type JoinSessionMessage = ClientMessageBase<
  ClientMessageType.JOIN_SESSION,
  JoinSessionPayload
>;
type AckServerActionMessage = ClientMessageBase<
  ClientMessageType.ACK_SERVER_ACTION,
  AckServerActionPayload
>;
type ClientActionMessage = ClientMessageBase<
  ClientMessageType.CLIENT_ACTION,
  ClientActionPayload
>;

// Slightly more refined type than ClientMessageBase,
// as it matches action types to their respective payloads
export type ClientMessage =
  | InitSessionMessage
  | JoinSessionMessage
  | AckServerActionMessage
  | ClientActionMessage;

/** Server message types */

export type ServerMessagePayload =
  | AckInitSessionPayload
  | AckEndSessionPayload
  | AckJoinSessionPayload
  | AckLeaveSessionPayload
  | SessionEndedPayload
  | GuestJoinedPayload
  | GuestLeftPayload
  | ServerActionPayload
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
export type SessionEndedMessage = ServerMessageBase<
  ServerMessageType.SESSION_ENDED,
  SessionEndedPayload
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
export type AckClientActionMessage = ServerMessageBase<
  ServerMessageType.ACK_CLIENT_ACTION,
  AckClientActionPayload
>;

// Slightly more refined type than ServerMessageBase,
// as it matches action types to their respective payloads
export type ServerMessage =
  | AckInitSessionMessage
  | AckJoinSessionMessage
  | SessionEndedMessage
  | GuestJoinedMessage
  | GuestLeftMessage
  | ServerActionMessage
  | AckClientActionMessage;
