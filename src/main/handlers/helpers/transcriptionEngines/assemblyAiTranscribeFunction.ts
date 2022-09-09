import fs from 'fs/promises';
import axios, { AxiosError } from 'axios';
import queryString from 'query-string';
import { JSONTranscription } from 'main/types';
import fetch from 'node-fetch';
import readDefaultEngineConfig from '../../file/readDefaultEngineConfig';

// Axios doesn't work for the file upload for some reason, so use node fetch instead.
// Have to use a slightly older version (2.6.6) as well due to module issues
import { TranscriptionFunction } from '../transcribeTypes';
import { getAudioExtractPath, roundToMs } from '../../../util';
import { sleep } from '../../../../sharedUtils';

// TODO: put in config
// const ASSEMBLYAI_API_KEY = 'fd0381ba0a274c09b2359005496fc79f';

const AUTH_ERROR_STRING = 'Authentication error, API token missing/invalid';

class ApiTokenError extends Error {}

const getApiKey = () => readDefaultEngineConfig().then((val) => val ?? '');

const uploadAudio = async (audioPath: string) => {
  const ASSEMBLYAI_API_KEY = await getApiKey();
  console.log(ASSEMBLYAI_API_KEY);
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

const initTranscription: (audioUrl: string) => Promise<string> = async (
  audioUrl
) => {
  const ASSEMBLYAI_API_KEY = await getApiKey();
  const endpoint = 'https://api.assemblyai.com/v2/transcript';

  const jsonData = {
    audio_url: audioUrl,
  };

  const headers = {
    authorization: ASSEMBLYAI_API_KEY,
    'content-type': 'application/json',
  };

  try {
    const { data } = await axios.post(endpoint, jsonData, { headers });

    return data.id;
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err.response?.data.error === AUTH_ERROR_STRING
    ) {
      throw new ApiTokenError(AUTH_ERROR_STRING);
    } else {
      throw err;
    }
  }

  // for linter
  return '';
};

const pollTranscriptionResultInner = async (transcriptionId: string) => {
  const ASSEMBLYAI_API_KEY = await getApiKey();
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
  words: wordList.map((val) => ({
    word: val.text,
    startTime: roundToMs(val.start / 1000),
    duration: roundToMs((val.end - val.start) / 1000),
    confidence: val.confidence,
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
