import { rangeLengthOne } from 'renderer/utils/range';
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
