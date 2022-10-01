import store from 'renderer/store/store';
import { toggleUpdateTranscriptionChoice } from 'renderer/store/menuCustomModals/actions';

const { dispatch } = store;

const openUpdateTranscriptionChoice: () => void = async () => {
  dispatch(toggleUpdateTranscriptionChoice(true));
};

export default openUpdateTranscriptionChoice;
