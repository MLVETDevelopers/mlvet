/**
 * https://github.com/stephenjjbrown/string-similarity-js
 * Calculate similarity between two strings
 * @param {string} str1 First string to match
 * @param {string} str2 Second string to match
 * @returns Number between 0 and 1, with 0 being a low match score.
 */
export const getSimilarityScore = (str1: string, str2: string): number => {
  const str1LowerCase = str1.toLowerCase();
  const str2LowerCase = str2.toLowerCase();
  const substringLength = 2;

  if (
    str1LowerCase.length < substringLength ||
    str2LowerCase.length < substringLength
  )
    return 0;

  const map = new Map();
  for (let i = 0; i < str1LowerCase.length - (substringLength - 1); i += 1) {
    const substr1LowerCase = str1LowerCase.substring(i, i + substringLength);
    map.set(
      substr1LowerCase,
      map.has(substr1LowerCase) ? map.get(substr1LowerCase) + 1 : 1
    );
  }

  let match = 0;
  for (let j = 0; j < str2LowerCase.length - (substringLength - 1); j += 1) {
    const substr2LowerCase = str2LowerCase.substring(j, j + substringLength);
    const count = map.has(substr2LowerCase) ? map.get(substr2LowerCase) : 0;
    if (count > 0) {
      map.set(substr2LowerCase, count - 1);
      match += 1;
    }
  }

  return (
    (match * 2) /
    (str1LowerCase.length + str2LowerCase.length - (substringLength - 1) * 2)
  );
};

export default getSimilarityScore;
