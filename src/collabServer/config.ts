const isTestEnv = process.env.JEST_WORKER_ID !== undefined;
const isServerEnv = process.env.PROD_SERVER !== undefined;

export const SERVER_TO_CLIENT_DELAY_SIMULATED =
  isTestEnv || isServerEnv ? 0 : 0.5; // seconds
export const COLLAB_SERVER_PORT = 5151;
export const LOG_VERBOSE = true;
