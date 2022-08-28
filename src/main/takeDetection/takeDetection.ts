/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs'; // <-- CPU
import { Tensor2D } from '@tensorflow/tfjs';
import fs from 'fs';

console.log = require('electron-log').info;

const sentences = [
  'What is up guys',
  'Hey guys',
  'In this video we will make a game',
  'So today we are making a game',
  'Hit like and subscribe',
  "Don't forget to like and subscribe",
  "Don't miss out on any videos",
  'Get notified of any new videos',
  'Leave a comment down below',
  'I try to read as many comments as I can',
  'Let me know if you guys like this video',
  'Thumbs up if you liked it',
  'See you guys in the next one',
  'I will see you all next time',
];

const similarityScore = async (
  indexA: number,
  indexB: number,
  embeddings: Tensor2D
) => {
  const sentenceAEmbeddings = tf.slice(embeddings, [indexA, 0], [1]);
  const sentenceBEmbeddings = tf.slice(embeddings, [indexB, 0], [1]);
  const sentenceATranspose = false;
  const sentenceBTransepose = true;
  const scoreData = await tf
    .matMul(
      sentenceAEmbeddings,
      sentenceBEmbeddings,
      sentenceATranspose,
      sentenceBTransepose
    )
    .data();

  return scoreData[0];
};

// eslint-disable-next-line import/prefer-default-export
export const findSimilarities = async (threshold = 0.65) => {
  console.log('Instantiating Model...');
  console.time('Model Embedding');
  const model = await use.load();
  const embeddings = await model.embed(sentences);
  console.timeEnd('Model Embedding');
  /*
   Expect ~9s on cpu
   Expect ~7.6s on gpu
   */

  console.log(`sentences here ${JSON.stringify(sentences)}`);

  console.log(sentences);
  sentences.map(async (_, index, array) => {
    if (index < array.length - 1) {
      const adjScore = await similarityScore(index, index + 1, embeddings);
      if (adjScore >= threshold) {
        const a = `${array[index]}\n${
          array[index + 1]
        }\nsimilarity: ${adjScore}\n`;
        console.log(a);
        // eslint-disable-next-line global-require
        fs.writeFileSync('C:/Users/hughr/Desktop/hello.txt', JSON.stringify(a));
      }
    }
  });
  console.log(`${sentences.length} Total Sentences`);
};
