import { ServerMessagePayload } from '../../collabTypes/collabSharedTypes';
import ICollabClient from './ICollabClient';

export type ServerMessageHandlerInner = (payload: ServerMessagePayload) => void;

export type ServerMessageHandler = (
  client: ICollabClient
) => ServerMessageHandlerInner;
