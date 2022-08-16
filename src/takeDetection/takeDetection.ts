/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-node-gpu'; // <-- GPU
// import * as tf from '@tensorflow/tfjs-node'; // <-- CPU
import { Tensor2D } from '@tensorflow/tfjs-node';

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

  console.log(sentences);
  await sentences.map(async (_, index, array) => {
    if (index < array.length - 1) {
      const adjScore = await similarityScore(index, index + 1, embeddings);
      if (adjScore >= threshold)
        console.log(
          `${array[index]}\n${array[index + 1]}\nsimilarity: ${adjScore}\n`
        );
    }
  });
  console.log(`${sentences.length} Total Sentences`);
};

export default findSimilarities;
