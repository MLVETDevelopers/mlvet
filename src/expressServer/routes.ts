import express from 'express';
import fs from 'fs';
import speech from '@google-cloud/speech';

const router = express.Router();
const client = new speech.SpeechClient();

router.get('/', (_, res) => {
  res.send('Server Running');
});

// TODO: After defining req and res, add types to them
const streamVideo: (req: any, res: any) => void = (req, res) => {
  const encodeFilePath = req.params.name;
  const sourcePath = Buffer.from(encodeFilePath, 'base64').toString('utf-8');
  const stat = fs.statSync(sourcePath);
  const fileSize = stat.size;
  const { range } = req.headers;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(sourcePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(sourcePath).pipe(res);
  }
};

router.get('/video/:name', streamVideo);

const transcribeGoogle = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const gcsUri = 'gs://mlvet/thanos.wav';
  const audio = {
    uri: gcsUri,
  };
  const config = {
    languageCode: 'en-US',
    audioChannelCount: 2,
    // enable_separate_recognition_per_channel = True,
    enableWordConfidence: true,
    enableWordTimeOffsets: true,
    model: 'video',
    enableAutomaticPunctuation: true,
  };

  const request = {
    audio,
    config,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  // const transcription = response.results
  //   .map((result) => result.alternatives[0].transcript)
  //   .join('\n');
  console.log('Returning transcription');
  res.send(response);
};

router.get('/transcribe/google', transcribeGoogle);

export default router;
