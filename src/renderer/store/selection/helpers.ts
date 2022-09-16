import { ClientId } from 'collabTypes/collabShadowTypes';
import { isInOriginalOrder } from 'renderer/utils/words';
import { IndexRange, Word } from 'sharedTypes';

export interface SelectionState {
  self: IndexRange;
  others: Record<ClientId, IndexRange>;
}

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

  const wordsToMerge = words.slice(range.startIndex, range.endIndex);
  const firstWord = words[range.startIndex];

  // Conditions
  const hasAtLeastTwoWords = wordsToMerge.length > 1;
  const noSelectedWordsDeleted = wordsToMerge.every((word) => !word.deleted);
  const inOriginalOrder = isInOriginalOrder(words, range);
  const isWordSplittable = firstWord.word.includes(' ');

  return {
    merge: hasAtLeastTwoWords && noSelectedWordsDeleted && inOriginalOrder,
    split: noSelectedWordsDeleted && isWordSplittable,
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
