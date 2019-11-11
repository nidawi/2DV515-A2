import Blog from '../model/Blog'; //eslint-disable-line
import Centroid from '../model/Centroid'; //eslint-disable-line

/**
 * Caluclates the Pearson distance between two blogs/centroids.
 * @export
 * @param {Blog|Centroid} aBlogA
 * @param {Blog|Centroid} aBlogB
 * @return {number} A float value representing similarity.
 */
export default function(aBlogA, aBlogB) {
  let sumA = 0;
  let sumB = 0;
  let sumAsq = 0;
  let sumBsq = 0;
  let pSum = 0;

  const words = aBlogA.getUniqueWords();
  words.forEach(w => {
    const countA = aBlogA.getWordCountFor(w);
    const countB = aBlogB.getWordCountFor(w);
    sumA += countA;
    sumB += countB;
    sumAsq += countA ** 2;
    sumBsq += countB ** 2;
    pSum += countA * countB;
  });

  const num = pSum - (sumA * sumB / words.length);
  const den = Math.sqrt(
    (sumAsq - sumA ** 2 / words.length) *
    (sumBsq - sumB ** 2 / words.length)
  );

  return 1.0 - (num / den);
}
