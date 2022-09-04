/* eslint-disable import/prefer-default-export */

import { ActionId } from 'collabSharedTypes';
import { Op } from '../undoStack/helpers';
import { DoPayload, UndoPayload } from '../undoStack/opPayloads';

export interface OpQueueItem {
  actionId: ActionId;
  op: Op<DoPayload, UndoPayload>;
}
