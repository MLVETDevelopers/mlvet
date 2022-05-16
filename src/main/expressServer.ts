/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChildProcess, spawn } from 'child_process';
import path from 'path';

export default function startExpressServer(): ChildProcess {
  const pathToServer = path.join(process.cwd(), 'src', 'expressServer');

  return spawn('node', ['server.js'], { cwd: pathToServer });
}
