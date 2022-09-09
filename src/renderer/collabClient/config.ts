/* eslint-disable import/prefer-default-export */

export const LOG_VERBOSE = true;

const USE_REMOTE_COLLAB = true;
export const COLLAB_HOST = USE_REMOTE_COLLAB
  ? 'ws://ec2-3-26-52-83.ap-southeast-2.compute.amazonaws.com:5151'
  : 'ws://localhost:5151';

// TODO: fix
export const CLIENT_TO_SERVER_DELAY_SIMULATED = 0; // isTestEnv ? 0 : 0.5; // seconds
