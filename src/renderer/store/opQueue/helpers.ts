/* eslint-disable import/prefer-default-export */

import { ActionId } from 'collabTypes/collabShadowTypes';
import { Op, OpPayload } from 'renderer/store/undoStack/helpers';

export interface OpQueueItem {
  actionId: ActionId;
  op: Op<OpPayload, OpPayload>;
}
