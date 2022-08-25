import fetch from 'node-fetch';

const googleTranscribeFunction = async (project) => {
  console.log('wtf');
  const response = await fetch('http://localhost:5556/transcribe/google', {
    method: 'GET',
  });

  const body = await response.text();

  console.log(body);
  return googleTranscriptionAdaptor(JSON.parse(body));
};

const googleTranscriptionAdaptor = (rawTranscription) => {
  // console.log(rawTranscription);
  let outputWords = [];
  for (let i = 0; i < rawTranscription.results.length; i++) {
    let words = rawTranscription.results[i].alternatives[0].words;
    // console.log('word set');
    // console.log(words);
    for (let j = 0; j < words.length; j++) {
      // console.log(words[j]);
      if (words[j].startTime.nanos == null) {
        words[j].startTime.nanos = 0;
      }
      if (words[j].endTime.nanos == null) {
        words[j].endTime.nanos = 0;
      }
      outputWords.push({
        word: words[j].word,
        startTime:
          parseInt(words[j].startTime.seconds) +
          words[j].startTime.nanos * 10 ** -9,
        duration:
          parseInt(words[j].endTime.seconds) +
          words[j].endTime.nanos * 10 ** -9 -
          (parseInt(words[j].startTime.seconds) +
            words[j].startTime.nanos * 10 ** -9),
      });
    }
  }
  console.log(outputWords);
  return { confidence: 1, words: outputWords };
};

export default googleTranscribeFunction;
