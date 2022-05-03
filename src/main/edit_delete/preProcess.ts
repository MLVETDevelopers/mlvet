import { Transcription } from 'sharedTypes';
import JSONTranscription from './JSONTranscription';
import TranscriptWord from './TranscriptWord';

const preProcessTranscript = (
  jsonTranscript: any,
  duration: number
): Transcription => {
  const numberOfWords: number = jsonTranscript.words.length;

  const processedTranscript: Transcription = new JSONTranscription(
    [],
    jsonTranscript.confidence
  );

  for (let i = 0; i < numberOfWords - 1; i += 1) {
    // duration includes the white space between current and next word
    const wordDuration =
      jsonTranscript.words[i + 1].start_time - jsonTranscript.words[i].start_time;
    // unique identifier for each word
    jsonTranscript.words[i].key = i.toString();
    const word = new TranscriptWord(
      i.toString(),
      jsonTranscript.words[i].word,
      jsonTranscript.words[i].start_time,
      wordDuration,
      'PLACEHOLDER FILENAME'
    );
    processedTranscript.words.push(word);
  }

  // last word in transcript
  const wordDuration =
    duration - jsonTranscript.words[numberOfWords - 1].start_time;
  const lastWord = new TranscriptWord(
    (numberOfWords - 1).toString(),
    jsonTranscript.words[numberOfWords - 1].word,
    jsonTranscript.words[numberOfWords - 1].start_time,
    wordDuration,
    'PLACEHOLDER FILENAME'
  );
  processedTranscript.words.push(lastWord);

  return processedTranscript;
};

export default preProcessTranscript;
