import { undoStackPushed } from './undoStack/actions';
import { Op } from './undoStack/helpers';
import { DoPayload, UndoPayload } from './undoStack/opPayloads';
import store from './store';

const { dispatch } = store;

/**
 * Dispatches an op, running its 'do' action and giving the undo stack a reference to the op.
 */
const dispatchOp: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>
) => void = (op) => {
  // Dispatch the actual actions
  op.do.forEach(dispatch);

  // Push the entire op to the undo stack, so that we can support undo and redo of this action
  dispatch(undoStackPushed(op));
};

export default dispatchOp;
