import Word from './Word';

interface Transcription {
  confidence: number;

  words: Word[];
}

export default Transcription;
