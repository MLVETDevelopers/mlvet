/* eslint-disable import/prefer-default-export */

import { TranscriptionEngine } from '../sharedTypes';

// Which transcription engine to use for any transcription.
// This will eventually be replaced with a config file allowing the user to choose which engine they want
export const TRANSCRIPTION_ENGINE = TranscriptionEngine.ASSEMBLYAI;

// If buffer duration is longer than this threshold,
// create an explicit pause object.
// Note that total pause must be longer than
// PAUSE_MAX_THRESHOLD * 2 as the buffer occurs on either side.
export const PAUSE_MAX_THRESHOLD = 0.3;

// Explicit pause objects will leave the following buffer on the
// words they are between.
export const PAUSE_DEFAULT_THRESHOLD = 0.2;
