import { undoStackPopped, undoStackPushed } from './undoStack/actions';
import { Op, DoPayload, OpPayload, UndoPayload } from './undoStack/helpers';
import store from './store';
import { opQueuePushed } from './opQueue/actions';

const { dispatch } = store;

/**
 * Dispatches an op, running its 'do' action and giving the undo stack a reference to the op.
 */
const dispatchOp: <T extends OpPayload, U extends OpPayload>(
  op: Op<T, U>,
  forceDispatch?: boolean
) => void = (op, forceDispatch = false) => {
  const { collab } = store.getState();

  if (!forceDispatch && collab !== null) {
    // Send the action to the collab server
    const client = collab.collabClient;
    const actionId = client.sendOp(op);

    console.log('op', op);

    // Queue the action to be run once it is ack'd by the server.
    // Pushing to the undo stack is now part of the op and we mark the op to skip the stack,
    // so that it can be undone by the op queue
    const newOp: Op<OpPayload, OpPayload> = {
      do: [...op.do, undoStackPushed(op as Op<DoPayload, UndoPayload>)],
      // TODO: may need a force-pop so the undo is genuine (rather than just moving an index)
      undo: [...op.undo, undoStackPopped()],
      skipStack: true,
    };
    dispatch(opQueuePushed(actionId, newOp));
  }

  // Dispatch the actual actions - these are tentatively eager-evaluated if there is a collab session
  // in progress and may be later undone by the op queue
  op.do.forEach(dispatch);

  if (!op.skipStack) {
    // Push the entire op to the undo stack, so that we can support undo and redo of this action
    dispatch(undoStackPushed(op as Op<DoPayload, UndoPayload>));
  }
};

export default dispatchOp;
