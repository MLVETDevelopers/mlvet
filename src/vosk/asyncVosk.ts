import getVoskTranscript from '.';

const dllLibsPath = process.argv[2];
const modelPath = process.argv[3];
const audioFilePath = process.argv[4];

// const transcript = getVoskTranscript(dllLibsPath, modelPath, audioFilePath);

const transcript = 'hello';

console.log('child:');

if (process.send) process.send(transcript);
else console.log('else');
