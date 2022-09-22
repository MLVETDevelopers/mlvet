import { startExport } from 'renderer/store/exportIo/actions';
import store from 'renderer/store/store';

const onExportStart: () => void = () => {
  store.dispatch(startExport());
};

export default onExportStart;
