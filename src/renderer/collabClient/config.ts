/* eslint-disable import/prefer-default-export */

const isTestEnv = process.env.JEST_WORKER_ID !== undefined;

export const LOG_VERBOSE = true;
export const COLLAB_HOST = 'ws://localhost:5151';
export const CLIENT_TO_SERVER_DELAY_SIMULATED = isTestEnv ? 0 : 0.5; // seconds
