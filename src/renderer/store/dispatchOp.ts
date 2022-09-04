import { undoStackPushed } from './undoStack/actions';
import { Op } from './undoStack/helpers';
import { DoPayload, UndoPayload } from './undoStack/opPayloads';
import store from './store';
import { opQueuePushed } from './opQueue/actions';

const { dispatch } = store;

/**
 * Dispatches an op, running its 'do' action and giving the undo stack a reference to the op.
 */
const dispatchOp: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>,
  forceDispatch?: boolean
) => void = (op, forceDispatch = false) => {
  const { collab } = store.getState();

  if (!forceDispatch && collab !== null) {
    // Send the action to the collab server
    const client = collab.collabClient;
    const actionId = client.sendOp(op);

    console.log('op', op);

    // Queue the action to be run once it is ack'd by the server
    dispatch(opQueuePushed(actionId, op));
  } else {
    // TODO: eagerly evaluate the following

    // Dispatch the actual actions
    op.do.forEach(dispatch);

    // Push the entire op to the undo stack, so that we can support undo and redo of this action
    dispatch(undoStackPushed(op));
  }
};

export default dispatchOp;
