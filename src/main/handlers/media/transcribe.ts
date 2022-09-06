import { JSONTranscription } from 'main/types';
import { RuntimeProject, TranscriptionEngine } from '../../../sharedTypes';
import { TranscriptionFunction } from '../helpers/transcribeTypes';
import dummyTranscribeFunction from '../helpers/transcriptionEngines/dummyTranscribeFunction';
import assemblyAiTranscribeFunction from '../helpers/transcriptionEngines/assemblyAiTranscribeFunction';

const getTranscriptionFunction: Record<
  TranscriptionEngine,
  TranscriptionFunction
> = {
  // Add the enum - function mapping for a transcription engine here
  [TranscriptionEngine.DUMMY]: dummyTranscribeFunction,
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
