import { ChildProcess, spawn } from 'child_process';
import path from 'path';

export default function startServer(): ChildProcess {
  const oldWorkingDirectory = process.cwd();
  const pathToServer = path.join(process.cwd(), 'src', 'py_server');

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
}
