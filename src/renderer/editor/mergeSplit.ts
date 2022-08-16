import { makeMergeWords } from "renderer/store/undoStack/ops";
import store from '../store/store';

const { dispatch } = store;

const mergeWords: () => void = {
    const ranges = getSelectionRanges();

    dispatchOp(makeMergeWords());
}
