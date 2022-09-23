import fs from 'fs';
import vosk from './vosk';
import { checkWavFile } from './wavUtils';

/**
 * Returns a transcript of the audio file at the given path using the Vosk model at the given path
 */
const getVoskTranscript = async (modelPath: string, filePath: string) => {
  // Read in the wav audio file as a buffer
  const audioBuffer = fs.readFileSync(filePath);

  // Confirm the audio file is in the correct format
  checkWavFile(audioBuffer);

  // Create the models
  const voskManager = vosk();
  const model = voskManager.createModel(modelPath);

  const voskRecognizer = voskManager.createRecognizer(model, 16000);
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
