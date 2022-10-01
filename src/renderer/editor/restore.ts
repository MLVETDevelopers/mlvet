import dispatchOp from 'renderer/store/dispatchOp';
import { IndexRange, Word } from 'sharedTypes';
import { makeRestoreSection } from 'renderer/store/transcriptionWords/ops/restoreSection';
import store from '../store/store';

/* Takes a start Index and find the index of the last word that is in the original transcription sequence
 * Returns an Index Range containing the start index and end index +1 of the section to be restored
 */
export const getRestoreRange: (
  startIndex: number,
  words: Word[]
) => IndexRange = (startIndex, words) => {
  const sectionToRestore = [...words].splice(startIndex);

  // This returns the index of first word in the section to restore that is either
  // not deleted or does not fit within the original sequence. Since we are using a
  // spliced array with the first word being the start of the section we are restoring,
  // we can assume this value to be equal to the number of words we are restoring.
  const lastWordInSequenceIndex = sectionToRestore.findIndex(
    (currWord, i, array) => {
      // Condition if we hit the last word in the array
      if (i >= array.length - 1) return !currWord.deleted;

      const nextWord = array[i + 1];

      return (
        !currWord.deleted ||
        !nextWord.deleted ||
        currWord.originalIndex + 1 !== nextWord.originalIndex
      );
    }
  );

  // If no last index is found, then we are restoring
  // from index until the end of the entire transcription.
  if (lastWordInSequenceIndex === -1) {
    return { startIndex, endIndex: words.length };
  }

  return { startIndex, endIndex: startIndex + lastWordInSequenceIndex + 1 };
};

export const getOriginalWords: (startIndex: number, words: Word[]) => Word[] = (
  startIndex,
  words
) => {
  const restoreIndexRange = getRestoreRange(startIndex, words);

  const originalWords = words.slice(
    restoreIndexRange.startIndex,
    restoreIndexRange.endIndex
  );

  return originalWords;
};

/* Takes a start index of a deleted section and restores the original transcription words that are
 * deleted and still in sequence
 */
export const restoreOriginalSection: (startIndex: number) => void = (
  startIndex
) => {
  const words = store.getState().currentProject?.transcription?.words ?? [];
  const range = getRestoreRange(startIndex, words);
  dispatchOp(makeRestoreSection(range));
};
