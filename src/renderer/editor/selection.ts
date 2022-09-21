import { rangeLengthOne } from 'renderer/utils/range';
import { Word } from 'sharedTypes';
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

  let startWord: Word;
  do {
    startIndex -= 1;
    if (startIndex < 0) {
      break;
    }
    startWord = currentProject.transcription.words[startIndex];
  } while (!checkSentenceEnd(startWord) || startWord.deleted);

  endIndex -= 1; // Account for the fact that the selection is exclusive of the end index
  let endWord = currentProject.transcription.words[endIndex];
  while (!(checkSentenceEnd(endWord) && endWord.deleted === false)) {
    endIndex += 1;
    if (endIndex >= currentProject.transcription.words.length) {
      break;
    }
    endWord = currentProject.transcription.words[endIndex];
  }
  dispatch(
    selectionRangeSetTo({
      startIndex: startIndex + 1,
      endIndex: endIndex + 1,
    })
  );
};
