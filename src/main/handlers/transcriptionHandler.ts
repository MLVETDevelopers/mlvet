import path from 'path';
import fs from 'fs';
import { io } from 'socket.io-client';
import { app } from 'electron';
import { Transcription } from '../../sharedTypes';
import preProcessTranscript from '../editDelete/preProcess';

/**
 * util to simulate running of transcription
 * @param n seconds to sleep
 * @returns promise resolving after n seconds
 */
const sleep: (n: number) => Promise<void> = (n) =>
  new Promise((resolve) => setTimeout(resolve, n * 1000));

const handleTranscription: (
  fileName: string
) => Promise<Transcription> = async () => {
  const socket = io('http://localhost:5000');
  socket.emit('transcribe', 'assets/videos/demo-video.mp4');
  let transcript = '';
  socket.on('transcription', (transcriptJson: any) => {
    transcript = transcriptJson;
  });
  // socket.disconnect();
  const jsonTranscript = JSON.parse(transcript);

  console.assert(jsonTranscript.transcripts.length === 1); // TODO: add more error handling here

  const duration = 0; // TODO: get actual duration from video
  const processedTranscript = preProcessTranscript(
    jsonTranscript.transcripts[0],
    duration
  );

  return processedTranscript;
};

export default handleTranscription;
