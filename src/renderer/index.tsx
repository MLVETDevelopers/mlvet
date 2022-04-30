import { render } from 'react-dom';
import App from './App';

// Make IPC listeners initialise themselves
import './ipc';

render(<App />, document.getElementById('root'));
