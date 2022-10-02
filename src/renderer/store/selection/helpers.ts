import { ClientId } from 'collabTypes/collabShadowTypes';
import { clampRange } from 'renderer/utils/range';
import { IndexRange, SelectionState, Word } from 'sharedTypes';

/**
 * Returns whether merge and/or split are allowed given the current state
 * of the transcription and selection
 *
 * @param words complete list of words in the transcription
 * @param range of currently selected words
 * @returns
 */
export const isMergeSplitAllowed: (
  words: Word[],
  range: IndexRange
) => { merge: boolean; split: boolean } = (words, range) => {
  if (words === undefined) {
    // No transcription, therefore can't merge / split
    return {
      merge: false,
      split: false,
    };
  }

  // Prevent crash if selection is outside the actual range of indexable words
  // (this would occur if undoing a paste from the end of the transcription)
  const { startIndex, endIndex } = clampRange(range, 0, words.length);

  const wordsToMerge = words.slice(startIndex, endIndex);
  const firstWord = words[startIndex];

  // Conditions
  const hasAtLeastTwoWords = wordsToMerge.length > 1;
  const hasExactlyOneWord = wordsToMerge.length === 1;
  const noSelectedWordsDeleted = wordsToMerge.every((word) => !word.deleted);
  const isWordSplittable = firstWord.word?.includes(' ') ?? false;

  return {
    merge: hasAtLeastTwoWords && noSelectedWordsDeleted,
    split: hasExactlyOneWord && noSelectedWordsDeleted && isWordSplittable,
  };
};

/**
 * Extracts a selection for the given client ID
 */
export const extractSelection: (
  selectionState: SelectionState,
  clientId: ClientId | null
) => IndexRange = (selectionState, clientId) =>
  clientId === null ? selectionState.self : selectionState.others[clientId];

/**
 * Immutably updates a selection for the given client ID (self if clientId is null)
 */
export const updateSelection: (
  clientId: ClientId | null,
  prevSelectionState: SelectionState,
  newSelection: IndexRange
) => SelectionState = (clientId, prevSelectionState, newSelection) => {
  return clientId === null
    ? {
        ...prevSelectionState,
        self: newSelection,
      }
    : {
        ...prevSelectionState,
        others: {
          ...prevSelectionState.others,
          [clientId]: newSelection,
        },
      };
};
