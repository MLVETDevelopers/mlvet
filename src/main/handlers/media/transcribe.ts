import { RuntimeProject } from 'sharedTypes';
import { JSONTranscription } from 'main/types';
import voskTranscribeFunction from '../helpers/transcriptionEngines/voskTranscribeFunction';
import {
  TranscriptionEngine,
  TranscriptionFunction,
} from '../helpers/transcribeTypes';
import deepspeechTranscribeFunction from '../helpers/transcriptionEngines/deepspeechTranscribeFunction';
import dummyTranscribeFunction from '../helpers/transcriptionEngines/dummyTranscribeFunction';
import assemblyAiTranscribeFunction from '../helpers/transcriptionEngines/assemblyAiTranscribeFunction';

const getTranscriptionFunction: Record<
  TranscriptionEngine,
  TranscriptionFunction
> = {
  // Add the enum - function mapping for a transcription engine here
  [TranscriptionEngine.VOSK]: voskTranscribeFunction,
  [TranscriptionEngine.DUMMY]: dummyTranscribeFunction,
  [TranscriptionEngine.DEEPSPEECH]: deepspeechTranscribeFunction,
  [TranscriptionEngine.ASSEMBLYAI]: assemblyAiTranscribeFunction,
};

type Transcribe = (
  project: RuntimeProject,
  transcriptionEngine: TranscriptionEngine
) => Promise<JSONTranscription>;

/**
 * Runs the transcription using the selected transcription engine
 * @param project the file to transcribe
 * @param transcriptionEngine The engine type used to transcribe
 * @returns a promise returning the JSONTranscription object of the transcription data
 *
 */
const transcribe: Transcribe = async (project, transcriptionEngine) => {
  const transcriptionFunction =
    getTranscriptionFunction[transcriptionEngine] ?? dummyTranscribeFunction;

  return transcriptionFunction(project);
};

export default transcribe;
