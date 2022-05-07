import { Transcription, Word } from 'sharedTypes';

const preProcessTranscript = (
  jsonTranscript: any,
  duration: number,
  fileName: string
): Transcription => {
  const numberOfWords: number = jsonTranscript.words.length;

  const processedTranscript: Transcription = {
    confidence: jsonTranscript.confidence,
    words: [],
    fileName,
  };

  for (let i = 0; i < numberOfWords - 1; i += 1) {
    // duration includes the white space between current and next word

    const wordDuration =
      jsonTranscript.words[i + 1].start_time -
      jsonTranscript.words[i].start_time;
    // unique identifier for each word
    jsonTranscript.words[i].key = i.toString();
    const word: Word = {
      word: jsonTranscript.words[i].word,
      startTime: jsonTranscript.words[i].start_time,
      duration: wordDuration,
      deleted: false,
      key: i.toString(),
      fileName: 'PLACEHOLDER FILENAME',
    };

    processedTranscript.words.push(word);
  }

  // last word in transcript
  const wordDuration =
    duration - jsonTranscript.words[numberOfWords - 1].start_time;

  const lastWord: Word = {
    word: jsonTranscript.words[numberOfWords - 1].word,
    startTime: jsonTranscript.words[numberOfWords - 1].start_time,
    duration: wordDuration,
    deleted: false,
    key: (numberOfWords - 1).toString(),
    fileName: 'PLACEHOLDER FILENAME',
  };
  processedTranscript.words.push(lastWord);
  return processedTranscript;
};

export default preProcessTranscript;
