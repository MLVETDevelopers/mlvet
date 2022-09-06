import { JSONTranscription } from 'main/types';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';
import transcribeWithVosk from '../../../../../vosk';

interface VoskWord {
  end: number;
  start: number;
  word: string;
}

const transcriptionAdaptor: (wordList: VoskWord[]) => JSONTranscription = (
  wordList
) => ({
  words: wordList.map((result) => ({
    word: result.word,
    startTime: result.start,
    duration: result.end - result.start,
    confidence: 0.6,
  })),
});

const voskTranscribeFunction: TranscriptionFunction = async (project) => {
  const audioPath = getAudioExtractPath(project.id);

  const jsonTranscript = JSON.parse(
    (await transcribeWithVosk(audioPath)) as string
  );

  console.log(jsonTranscript);

  return transcriptionAdaptor(jsonTranscript.alternatives[0].result || []);
};

export default voskTranscribeFunction;
