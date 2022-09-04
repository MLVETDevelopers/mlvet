/* eslint-disable import/prefer-default-export */

import { ActionId } from 'collabSharedTypes';
import { Op, OpPayload } from 'renderer/store/undoStack/helpers';

export interface OpQueueItem {
  actionId: ActionId;
  op: Op<OpPayload, OpPayload>;
}
