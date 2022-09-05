import { ClientId } from 'collabTypes/collabShadowTypes';
import { isInOriginalOrder } from 'renderer/utils/words';
import { IndexRange, Word } from 'sharedTypes';
import { SelectionIndices, SelectionState } from '../sharedHelpers';

/**
 * Returns whether merge and/or split are allowed given the current state
 * of the transcription and selection
 *
 * @param words complete list of words in the transcription
 * @param ranges of currently selected words
 * @returns
 */
export const isMergeSplitAllowed: (
  words: Word[],
  ranges: IndexRange[]
) => { merge: boolean; split: boolean } = (words, ranges) => {
  if (words === undefined) {
    // No transcription, therefore can't merge / split
    return {
      merge: false,
      split: false,
    };
  }

  if (ranges.length !== 1) {
    // No selection or non contiguous selection, therefore can't merge / split
    return {
      merge: false,
      split: false,
    };
  }

  const range = ranges[0];
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
) => SelectionIndices = (selectionState, clientId) =>
  clientId === null ? selectionState.self : selectionState.others[clientId];

/**
 * Immutably updates a selection for the given client ID (self if clientId is null)
 */
export const updateSelection: (
  clientId: ClientId | null,
  prevSelectionState: SelectionState,
  newSelection: SelectionIndices
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
