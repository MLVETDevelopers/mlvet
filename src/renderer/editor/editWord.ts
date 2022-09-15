import store from '../store/store';
import { editWordStarted } from '../store/editWord/actions';
import { getSelectionRanges } from './selection';

const { dispatch } = store;

const editWord = () => {
  const words = store.getState().currentProject?.transcription?.words;
  if (words === undefined) {
    return;
  }
  const ranges = getSelectionRanges();
  if (ranges.length === 0) {
    return;
  }
  // Assume that only one word is selected, thus there is only one range and start/end indexes are the same
  const index = ranges[0].startIndex;
  const { word } = words[index];
  dispatch(editWordStarted(index, word));
};

export default editWord;
