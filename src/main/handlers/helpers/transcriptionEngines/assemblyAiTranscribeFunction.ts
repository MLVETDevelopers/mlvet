import fs from 'fs/promises';
import axios from 'axios';
import queryString from 'query-string';
import { JSONTranscription } from 'main/types';

// Axios doesn't work for the file upload for some reason, so use node fetch instead.
// Have to use a slightly older version (2.6.6) as well due to module issues
import fetch from 'node-fetch';
import { TranscriptionFunction } from '../transcribeTypes';
import { getAudioExtractPath, roundToMs } from '../../../util';

const sleep: (seconds: number) => Promise<void> = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// TODO: put in config
const ASSEMBLYAI_API_KEY = 'fd0381ba0a274c09b2359005496fc79f';

const uploadAudio = async (audioPath: string) => {
  const data = await fs.readFile(audioPath);

  const url = 'https://api.assemblyai.com/v2/upload';

  const params = {
    authorization: ASSEMBLYAI_API_KEY,
    'Transfer-Encoding': 'chunked',
  };
  const paramsString = queryString.stringify(params);

  const { upload_url: uploadUrl } = await fetch(`${url}?${paramsString}`, {
    body: data,
    method: 'POST',
    headers: {
      'Content-Type': 'audio/wave',
    },
  }).then((response: any) => response.json());

  return uploadUrl;
};

const initTranscription = async (audioUrl: string) => {
  const endpoint = 'https://api.assemblyai.com/v2/transcript';

  const jsonData = {
    audio_url: audioUrl,
  };

  const headers = {
    authorization: ASSEMBLYAI_API_KEY,
    'content-type': 'application/json',
  };

  const { data } = await axios.post(endpoint, jsonData, { headers });

  const { id } = data;

  return id;
};

const pollTranscriptionResultInner = async (transcriptionId: string) => {
  const endpoint = `https://api.assemblyai.com/v2/transcript/${transcriptionId}`;

  const headers = {
    authorization: ASSEMBLYAI_API_KEY,
  };

  const { data } = await axios.get(endpoint, { headers });

  return data;
};

const pollTranscriptionResult = async (transcriptionId: string) => {
  const POLL_FREQUENCY = 2; // every N seconds
  let data = await pollTranscriptionResultInner(transcriptionId);

  while (['processing', 'queued'].includes(data.status)) {
    console.log(`Polled for transcription status - ${data.status}`);

    // eslint-disable-next-line no-await-in-loop
    await sleep(POLL_FREQUENCY);

    // eslint-disable-next-line no-await-in-loop
    data = await pollTranscriptionResultInner(transcriptionId);
  }

  return data;
};

interface AssemblyAiWord {
  text: string;
  start: number; // milliseconds
  end: number; // milliseconds
  confidence: number;
  speaker: null;
}

const transcriptionAdaptor: (
  wordList: AssemblyAiWord[]
) => JSONTranscription = (wordList) => ({
  confidence: 0,
  words: wordList.map((val) => ({
    word: val.text,
    startTime: roundToMs(val.start / 1000),
    duration: roundToMs((val.end - val.start) / 1000),
  })),
});

const assemblyAiTranscribeFunction: TranscriptionFunction = async (project) => {
  const audioPath = getAudioExtractPath(project.id);

  console.log(`Uploading audio to AssemblyAI, path: ${audioPath}`);

  const audioUrl = await uploadAudio(audioPath);

  console.log(`Uploaded audio to AssemblyAI, starting transcription`);

  const transcriptionId = await initTranscription(audioUrl);

  console.log(`AssemblyAI transcription started`);

  const transcription = await pollTranscriptionResult(transcriptionId);

  console.log(
    `AssemblyAI transcription completed, ${transcription.words.length} words received`
  );

  return transcriptionAdaptor(transcription.words || []);
};

export default assemblyAiTranscribeFunction;
