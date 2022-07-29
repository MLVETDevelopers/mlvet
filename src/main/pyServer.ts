import { ChildProcess, spawn } from 'child_process';
import { get } from 'http';
import path from 'path';

export const startServer: () => ChildProcess = () => {
  const oldWorkingDirectory = process.cwd();
  const pathToServer = path.join(process.cwd(), 'src', 'pyServer');

  process.chdir(pathToServer);
  let proc = null;

  if (process.env.FLASK_PORT !== undefined) {
    proc = spawn('flask', ['run', `--port=${process.env.FLASK_PORT}`]);
  } else {
    proc = spawn('flask', ['run']);
  }

  // resetting working directory to project root.
  process.chdir(oldWorkingDirectory);
  return proc;
};

export const pingServer: (pyServer: ChildProcess) => void = (pyServer) => {
  if (pyServer !== null && pyServer.stderr !== null) {
    // Flask logs to stderr when server is ready. Hence, we listen to stderr rather than stdout
    // More information why we listen to stderr here: https://github.com/chloebrett/mlvet/pull/3#discussion_r830701799
    pyServer.stderr.once('data', (data) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(data.toString()); // prints address that the server is running on. TODO: remove before it is electron app is built
      }
      get(`http://localhost:${process.env.FLASK_PORT}`, (res) => {
        if (res.statusCode === 200) {
          console.log('Python server is running');
        } else {
          throw new Error(
            `Python server has an error, response to a get '/' expected code 200 got ${res.statusCode}`
          );
        }
      });
    });
  }
};
