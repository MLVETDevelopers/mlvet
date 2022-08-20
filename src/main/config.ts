/* eslint-disable import/prefer-default-export */

import { TranscriptionEngine } from './handlers/media/transcriptionEngines';

// Whether to use the sample transcription instead of actually transcribing.
// Useful for testing.
export const TRANSCRIPTION_ENGINE = TranscriptionEngine.DEEPSPEECH;
