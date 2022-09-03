import { Op, UndoStack } from 'renderer/store/undoStack/helpers';
import { DoPayload, UndoPayload } from 'renderer/store/undoStack/opPayloads';
import { Transcription } from 'sharedTypes';

/** Server actions */

interface ServerAction {
  op: Op<DoPayload, UndoPayload>;
  clientId: string;
  index: number;
  id: string; // UUID
}

/** Message types */

export enum ClientMessageType {
  INIT_SESSION = 'init-session',
  END_SESSION = 'end-session',
  JOIN_SESSION = 'join-session',
  LEAVE_SESSION = 'leave-session',
  ACK_SERVER_ACTION = 'ack-server-action',
  CLIENT_ACTION = 'client-action',
}

export enum ServerMessageType {
  ACK_INIT_SESSION = 'ack-init-session',
  ACK_END_SESSION = 'ack-end-session',
  ACK_JOIN_SESSION = 'ack-join-session',
  ACK_LEAVE_SESSION = 'ack-leave-session',
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
  U extends ServerMessagePayload
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

export type EndSessionPayload = null;

export interface JoinSessionPayload {
  sessionCode: string;
  clientName: string;
}

export type LeaveSessionPayload = null;

export interface AckServerActionPayload {
  index: number; // index of the most recent action that was ack'd
}

export interface ClientActionPayload {
  id: string; // UUID
  ops: Op<DoPayload, UndoPayload>[];
}

/** Server message payloads */

export interface AckInitSessionPayload {
  sessionCode: string;
  clientId: string;
}

export type AckEndSessionPayload = null;

export interface AckJoinSessionPayload {
  transcription: Transcription;
  undoStack: UndoStack;
  otherClientNames: string[];
  clientId: string;
  mediaFileName: string;
}

export type AckLeaveSessionPayload = null;

export type SessionEndedPayload = null;

export interface GuestJoinedPayload {
  clientName: string;
  clientId: string;
}

export interface GuestLeftPayload {
  clientId: string;
}

export interface ServerActionPayload {
  clientId: string;
  actions: ServerAction[];
}

export interface AckClientActionPayload {
  id: string;
}

/** Client message types */

export type ClientMessagePayload =
  | InitSessionPayload
  | EndSessionPayload
  | JoinSessionPayload
  | LeaveSessionPayload
  | AckServerActionPayload
  | AckClientActionPayload;

type InitSessionMessage = ClientMessageBase<
  ClientMessageType.INIT_SESSION,
  InitSessionPayload
>;
type EndSessionMessage = ClientMessageBase<
  ClientMessageType.END_SESSION,
  EndSessionPayload
>;
type JoinSessionMessage = ClientMessageBase<
  ClientMessageType.JOIN_SESSION,
  JoinSessionPayload
>;
type LeaveSessionMessage = ClientMessageBase<
  ClientMessageType.LEAVE_SESSION,
  LeaveSessionPayload
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
  | EndSessionMessage
  | JoinSessionMessage
  | LeaveSessionMessage
  | AckServerActionMessage
  | ClientActionMessage;

/** Server message types */

type ServerMessagePayload =
  | AckInitSessionPayload
  | AckEndSessionPayload
  | AckJoinSessionPayload
  | AckLeaveSessionPayload
  | SessionEndedPayload
  | GuestJoinedPayload
  | GuestLeftPayload
  | ServerActionPayload
  | AckClientActionPayload;

type AckInitSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_INIT_SESSION,
  AckInitSessionPayload
>;
type AckEndSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_END_SESSION,
  AckEndSessionPayload
>;
type AckJoinSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_JOIN_SESSION,
  AckJoinSessionPayload
>;
type AckLeaveSessionMessage = ServerMessageBase<
  ServerMessageType.ACK_LEAVE_SESSION,
  AckLeaveSessionPayload
>;
type SessionEndedMessage = ServerMessageBase<
  ServerMessageType.SESSION_ENDED,
  SessionEndedPayload
>;
type GuestJoinedMessage = ServerMessageBase<
  ServerMessageType.GUEST_JOINED,
  GuestJoinedPayload
>;
type GuestLeftMessage = ServerMessageBase<
  ServerMessageType.GUEST_LEFT,
  GuestLeftPayload
>;
type ServerActionMessage = ServerMessageBase<
  ServerMessageType.SERVER_ACTION,
  ServerActionPayload
>;
type AckClientActionMessage = ServerMessageBase<
  ServerMessageType.ACK_CLIENT_ACTION,
  AckClientActionPayload
>;

// Slightly more refined type than ServerMessageBase,
// as it matches action types to their respective payloads
export type ServerMessage =
  | AckInitSessionMessage
  | AckEndSessionMessage
  | AckJoinSessionMessage
  | AckLeaveSessionMessage
  | SessionEndedMessage
  | GuestJoinedMessage
  | GuestLeftMessage
  | ServerActionMessage
  | AckClientActionMessage;
