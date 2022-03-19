import { spawn } from 'child_process';
import path from 'path';

export default function startServer() {
  const oldWorkingDirectory = process.cwd();
  const pathToServer = path.join(process.cwd(), '/src/py_server');

  process.chdir(pathToServer);

  const proc = spawn('flask', ['run']);

  // resetting working directory to project root.
  process.chdir(oldWorkingDirectory);
  return proc;
}
