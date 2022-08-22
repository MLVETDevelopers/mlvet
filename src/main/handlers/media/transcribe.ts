import { RuntimeProject } from 'sharedTypes';
import voskTranscribeFunction from './transcriptionEngines/voskTranscribeFunction';
import { TranscriptionEngine, TranscriptionFunction } from './transcribeTypes';
import deepspeechTranscribeFunction from './transcriptionEngines/deepspeechTranscribeFunction';
import dummyTranscribeFunction from './transcriptionEngines/dummyTranscribeFunction';

const getTranscriptionFunction = new Map<
  TranscriptionEngine,
  TranscriptionFunction
>();

// Add the enum - function mapping for a transcription engine here
getTranscriptionFunction.set(TranscriptionEngine.VOSK, voskTranscribeFunction);
getTranscriptionFunction.set(
  TranscriptionEngine.DEEPSPEECH,
  deepspeechTranscribeFunction
);
getTranscriptionFunction.set(
  TranscriptionEngine.DUMMY,
  dummyTranscribeFunction
);

/**
 * Runs the transcription using the selected transcription engine
 * @param project the file to transcribe
 * @param transcriptionEngine The engine type used to transcribe
 * @returns a promise returning the JSONTranscription object of the transcription data
 *
 */
const transcribe = async (
  project: RuntimeProject,
  transcriptionEngine: TranscriptionEngine
) => {
  const transcriptionFunction =
    getTranscriptionFunction.get(transcriptionEngine) ??
    dummyTranscribeFunction;
  return transcriptionFunction(project);
};

export default transcribe;
