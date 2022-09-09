import { Reducer } from 'redux';
import {
  OP_QUEUE_ACTION_ACCEPTED,
  OP_QUEUE_ACTION_REJECTED,
  OP_QUEUE_PUSHED,
  OpQueueActionAcceptedPayload,
  OpQueueActionRejectedPayload,
  OpQueuePushedPayload,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const opQueueReducer: Reducer<ApplicationStore['opQueue'], Action<any>> = (
  opQueue = initialStore.opQueue,
  action
) => {
  if (action.type === OP_QUEUE_PUSHED) {
    const { item } = action.payload as OpQueuePushedPayload;

    return opQueue.concat([item]);
  }

  if (action.type === OP_QUEUE_ACTION_ACCEPTED) {
    const { actionId } = action.payload as OpQueueActionAcceptedPayload;

    const fromIndex = opQueue.findIndex((item) => item.actionId === actionId);

    if (fromIndex === -1) {
      return opQueue;
    }

    return opQueue.slice(fromIndex + 1);
  }

  if (action.type === OP_QUEUE_ACTION_REJECTED) {
    const { actionId } = action.payload as OpQueueActionRejectedPayload;

    const fromIndex = opQueue.findIndex((item) => item.actionId === actionId);

    if (fromIndex === -1) {
      return opQueue;
    }

    return opQueue.slice(0, fromIndex);
  }

  return opQueue;
};

export default opQueueReducer;
