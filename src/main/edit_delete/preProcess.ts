import { Transcription } from 'sharedTypes';

const preProcessTranscript = (
  jsonTranscript: any,
  duration: number
): Transcription => {
  const numberOfWords: number = jsonTranscript.words.length;

  for (let i = 0; i < numberOfWords - 1; i += 1) {
    // duration includes the white space between current and next word
    jsonTranscript.words[i].duration =
      jsonTranscript[i + 1].start_time - jsonTranscript.words[i].start_time;
    jsonTranscript.words[i].deleted = false;
    // unique identifier for each word
    jsonTranscript.words[i].key = i.toString();
  }
  // last word in transcript
  jsonTranscript.words[numberOfWords - 1].duration =
    duration - jsonTranscript.words[numberOfWords - 1].start_time;
  jsonTranscript.words[numberOfWords - 1].deleted = false;
  jsonTranscript.words[numberOfWords - 1].deleted = false;

  return jsonTranscript;
};

export default preProcessTranscript;
