export default function getSimilarityScore(
  sentenceOne: string,
  sentenceTwo: string
): number {
  // For mock, just return 1 (100% similar) if the sentences start with the same letter, otherwise 0 (0% similar) - allows for some meaningful testing

  return sentenceOne[0].toLowerCase() === sentenceTwo[0].toLowerCase() ? 1 : 0;
}
