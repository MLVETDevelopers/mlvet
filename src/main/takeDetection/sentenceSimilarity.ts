export default function getSimilarityScore(
  sentenceOne: string,
  sentenceTwo: string
): number {
  sentenceOne.concat(sentenceTwo);
  return 0.5;
}
