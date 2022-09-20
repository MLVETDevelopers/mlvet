import { getLengthOfRange } from 'renderer/utils/range';
import store from '../store/store';
import { editWordStarted } from '../store/editWord/actions';

const { dispatch } = store;

const editWord = () => {
  const words = store.getState().currentProject?.transcription?.words;
  if (words === undefined) {
    return;
  }

  const range = store.getState().selection.self;
  const { startIndex } = range;
  const { word } = words[startIndex];

  // Ensure that exactly one word is selected
  if (getLengthOfRange(range) !== 1) {
    return;
  }

  // Don't allow editing the 'text' of pauses
  if (word === null) {
    return;
  }

  dispatch(editWordStarted(startIndex, word));
};

export default editWord;
