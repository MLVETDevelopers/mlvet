/* eslint-disable import/prefer-default-export */

import { ActionId } from 'collabSharedTypes';
import { Op } from '../undoStack/helpers';
import { OpPayload } from '../undoStack/opPayloads';

export interface OpQueueItem {
  actionId: ActionId;
  op: Op<OpPayload, OpPayload>;
}
