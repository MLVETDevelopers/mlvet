import store from 'renderer/store/store';
import { toggleUpdateTranscriptionAPIKey } from 'renderer/store/updateTranscriptionAPIKey/actions';

const { dispatch } = store;

const openUpdateTranscriptionAPIKey: () => any = async () => {
  dispatch(toggleUpdateTranscriptionAPIKey(true));
};

export default openUpdateTranscriptionAPIKey;
