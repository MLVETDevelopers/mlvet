import getVoskTranscript from '.';

const dllLibsPath = process.argv[2];
const modelPath = process.argv[3];
const audioFilePath = process.argv[4];

try {
  const transcript = getVoskTranscript(dllLibsPath, modelPath, audioFilePath);
  const output = JSON.stringify({
    res: transcript,
    success: true,
    error: null,
  });
  console.log(output);
} catch (error) {
  const output = JSON.stringify({
    res: null,
    success: false,
    error,
  });
  console.log(output);
}
