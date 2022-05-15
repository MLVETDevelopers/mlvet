import { render } from 'react-dom';
import App from './App';

// Make IPC listeners initialise themselves
import './ipcRegistration';

render(<App hasStoreChangeObserver />, document.getElementById('root'));
