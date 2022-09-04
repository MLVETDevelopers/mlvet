import { ActionId } from 'collabSharedTypes';
import { Action } from '../action';
import { Op } from '../undoStack/helpers';
import { DoPayload, UndoPayload } from '../undoStack/opPayloads';
import { OpQueueItem } from './helpers';

export const OP_QUEUE_PUSHED = 'OP_QUEUE_PUSHED';

export const OP_QUEUE_ACTION_ACCEPTED = 'OP_QUEUE_ACTION_ACCEPTED';

export const OP_QUEUE_ACTION_REJECTED = 'OP_QUEUE_ACTION_REJECTED';

export interface OpQueuePushedPayload {
  item: OpQueueItem;
}

export interface OpQueueActionAcceptedPayload {
  actionId: ActionId;
}

export interface OpQueueActionRejectedPayload {
  actionId: ActionId;
}

export const opQueuePushed: (
  actionId: ActionId,
  op: Op<DoPayload, UndoPayload>
) => Action<OpQueuePushedPayload> = (actionId, op) => ({
  type: OP_QUEUE_PUSHED,
  payload: {
    item: {
      actionId,
      op,
    },
  },
});

export const opQueueActionAccepted: (
  actionId: ActionId
) => Action<OpQueueActionAcceptedPayload> = (actionId) => ({
  type: OP_QUEUE_ACTION_ACCEPTED,
  payload: {
    actionId,
  },
});

export const opQueueActionRejected: (
  actionId: ActionId
) => Action<OpQueueActionRejectedPayload> = (actionId) => ({
  type: OP_QUEUE_ACTION_REJECTED,
  payload: {
    actionId,
  },
});
