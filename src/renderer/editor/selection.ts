import { rangeLengthOne } from 'renderer/utils/range';
import { checkSentenceEnd } from '../../sharedUtils';
import { selectionRangeSetTo } from '../store/selection/actions';
import store from '../store/store';

const { dispatch } = store;

export const handleSelectWord: (wordIndex: number) => Promise<void> = async (
  index
) => {
  const singleWordRange = rangeLengthOne(index);

  dispatch(selectionRangeSetTo(singleWordRange));
};

export const selectAllWords: () => void = () => {
  const { currentProject } = store.getState();

  if (currentProject === null || currentProject?.transcription === null) {
    return;
  }

  dispatch(
    selectionRangeSetTo({
      startIndex: 0,
      endIndex: currentProject.transcription.words.length,
    })
  );
};

export const selectSentence: () => void = () => {
  const { currentProject } = store.getState();

  if (currentProject === null || currentProject?.transcription === null) {
    return;
  }
  let { startIndex, endIndex } = store.getState().selection.self;
  endIndex -= 1; // Account for the fact that the selection is exclusive of the end index
  startIndex -= 1; // Move past the current word to account for the edge case of selecting a sentence end word
  let startWord = currentProject.transcription.words[startIndex];
  while (!(checkSentenceEnd(startWord) && startWord.deleted === false)) {
    startIndex -= 1;
    startWord = currentProject.transcription.words[startIndex];
  }
  let endWord = currentProject.transcription.words[endIndex];
  while (!(checkSentenceEnd(endWord) && startWord.deleted === false)) {
    endIndex += 1;
    endWord = currentProject.transcription.words[endIndex];
  }
  dispatch(
    selectionRangeSetTo({
      startIndex: startIndex + 1,
      endIndex: endIndex + 1,
    })
  );
};
