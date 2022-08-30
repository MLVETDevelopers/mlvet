import { SELECTION_RANGE_ADDED } from 'renderer/store/selection/actions';
import { Word } from 'sharedTypes';
import { expandSelectionToWord, getSelectionRanges } from '../editor/selection';
import { ApplicationStore, initialStore } from '../store/sharedHelpers';
import store from '../store/store';

const makeBasicWordSequential: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean
) => Word = (originalIndex, text, isDeleted = false, pasteKey = 0) => ({
  word: text,
  startTime: 0,
  duration: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  originalIndex,
  pasteKey,
  confidence: 1,
  takeInfo: null,
});

// describe('getSelectionRanges', () => {
//   it('should return empty list of ranges when selection is empty', () => {
//     getStateMock.mockReturnValue({
//       ...initialStore,
//       currentProject: {
//         ...initialStore.currentProject,
//       },
//     });

//     const ranges = getSelectionRanges();

//     expect(ranges).toEqual([]);
//   });
// });
