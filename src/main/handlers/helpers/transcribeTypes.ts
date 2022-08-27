import { RuntimeProject } from 'sharedTypes';
import { JSONTranscription } from '../../types';

// To add a new transcription engine, create a function of type Transcription function
// in the transcriptionEngines folder
export type TranscriptionFunction = (
  project: RuntimeProject
) => Promise<JSONTranscription>;

// Then add the new engine to this enum
export enum TranscriptionEngine {
  DUMMY,
  VOSK,
  DEEPSPEECH,
  ASSEMBLYAI,
}

// Then add associate the new transcription function with the enum in the
// getTranscriptionFunction map in transcribe.ts
