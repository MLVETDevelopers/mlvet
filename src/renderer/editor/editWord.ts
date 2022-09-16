import store from '../store/store';
import { editWordStarted } from '../store/editWord/actions';

const { dispatch } = store;

const editWord = () => {
  const words = store.getState().currentProject?.transcription?.words;
  if (words === undefined) {
    return;
  }

  const range = store.getState().selection.self;

  // Assume that only one word is selected, thus there is only one range and start/end indexes are the same
  const { startIndex } = range;
  const { word } = words[startIndex];
  dispatch(editWordStarted(startIndex, word));
};

export default editWord;
