import fs from 'fs';
import vosk from './vosk';
import { checkWavFile } from './wavUtils';

const getVoskTranscript = async (modelPath: string, filePath: string) => {
  // Read in the wav audio file as a buffer
  const audioBuffer = fs.readFileSync(filePath);

  // Confirm the audio file is in the correct format
  checkWavFile(audioBuffer);

  // Create the models
  const vosky = vosk();
  const model = vosky.createModel(modelPath);

  const voskRecognizer = vosky.createRecognizer(model, 16000);
  voskRecognizer.setMaxAlternatives(1);
  voskRecognizer.setWords(true);

  // Process the audio file with the model
  voskRecognizer.acceptWaveform(audioBuffer);

  // Get the transcript result from the model
  const result = JSON.parse(voskRecognizer.resultString());
  const transcript: string = JSON.stringify(result, null, 4);

  // Free the model resources
  voskRecognizer.free();
  model.free();

  return transcript;
};

export default getVoskTranscript;
