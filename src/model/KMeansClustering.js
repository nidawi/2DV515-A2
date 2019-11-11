import DataManager from './DataManager'; // eslint-disable-line no-unused-vars
import Centroid from './Centroid';
import pearson from '../lib/Pearson';

export default class KMeansClustering {
  /**
   * Creates an instance of KMeansClustering.
   * Please, for the love of god, do not touch functions
   * prefixed with _ and especially not __.
   * What's a "law-of-demeter"? I've never heard of it.
   * @param {DataManager} aDataMgr DataManager to use.
   * @memberof KMeansClustering
   */
  constructor(aDataMgr) {
    this._dataMgr = aDataMgr;

    /**
     * @type {Centroid[]}
     */
    this._centroids = [];
    /**
     * Represents the number of iterations of the last clustering operation.
     * Useful for debugging and trivia.
     * @type {number}
     */
    this._iterations = 0;
  }

  /**
   * Executes the K-Means clustering operation.
   * This updates the state of this object to represent the results
   * of the operation. One instance can only represent one operation.
   * Also returns the resulting clusters.
   * @param {number} [aCount=5] Number of pre-determined clusters.
   * Defaults to 5.
   * @param {number|boolean} [aIters=20] Number of iterations. Defaults to 20.
   * Leave as false to let the operation figure it out itself.
   * @return {Centroid[]} An array of resulting clusters.
   * @memberof KMeansClustering
   */
  executeClustering(aCount = 5, aIters = 20) {
    if (aIters === false) return this.__smartClustering(aCount);
    else return this.__fixedClustering(aCount, aIters);
  }

  /**
   * Performs a fixed-iteration clustering.
   * Do not use this manually.
   * @param {number} [aCount=5]
   * @param {number} [aIters=20]
   * @return {Centroid[]} An array of resulting clusters.
   * @memberof KMeansClustering
   */
  __fixedClustering(aCount = 5, aIters = 20) {
    this._iterations = 0;
    this._generateCentroids(aCount);

    const blogs = this._dataMgr.getBlogs();
    const words = this._dataMgr.getWords();

    for (let i = 0; i < aIters; i++) {
      // increase iter trivia
      this._iterations++;

      // clear assignments
      this._clearAssignments();

      // assign blogs to closest centroid
      blogs.forEach(b => {
        let distance = Number.MAX_VALUE;
        let best = undefined;

        this._centroids.forEach(c => {
          const cDist = pearson(c, b);
          if (cDist < distance) {
            best = c;
            distance = cDist;
          }
        });

        best.assign(b);
      });

      // calculate new center for centroids
      this._calculateCentroids(words);
    }

    return this.getClusters();
  }

  /**
   * Performs a smart, dynamic-iteration clustering.
   * Do not use this manually.
   * @param {number} [aCount=5]
   * @return {Centroid[]} An array of resulting clusters.
   * @memberof KMeansClustering
   */
  __smartClustering(aCount = 5) {
    this._iterations = 0;
    this._generateCentroids(aCount);

    const blogs = this._dataMgr.getBlogs();
    const words = this._dataMgr.getWords();

    // check if all clusters are labelled as finished.
    while (!this._centroids.every(a => a.isFinished())) {
      // increase iter trivia
      this._iterations++;

      // clear assignments
      this._clearAssignments();

      // assign blogs to closest centroid
      blogs.forEach(b => {
        let distance = Number.MAX_VALUE;
        let best = undefined;

        this._centroids.forEach(c => {
          const cDist = pearson(c, b);
          if (cDist < distance) {
            best = c;
            distance = cDist;
          }
        });

        best.assign(b);
      });

      // calculate new center for centroids
      this._calculateCentroids(words);

      this._centroids.forEach(a => a.checkFinished());
    }

    return this.getClusters();
  }

  /**
   * Returns an array of clusters that were yielded by
   * a clustering operation.
   * @return {Centroid[]} An array of resulting clusters.
   * @memberof KMeansClustering
   */
  getClusters() {
    return this._centroids.slice(0);
  }

  getMaxOccurencesOf(aWord) {
    return Math.max(...this._dataMgr
      .getBlogs()
      .map(a => a.getWordCountFor(aWord)));
  }

  getMinOccurencesOf(aWord) {
    return Math.min(...this._dataMgr
      .getBlogs()
      .map(a => a.getWordCountFor(aWord)));
  }

  getRandomCountFor(aWord) {
    const max = this.getMaxOccurencesOf(aWord);
    const min = this.getMinOccurencesOf(aWord);

    return Math.floor(Math.random() * (max - min + 1)) + 1;
  }

  _generateCentroids(aCentroidCount) {
    this._centroids = [];
    const words = this._dataMgr.getWords();

    for (let i = 0; i < aCentroidCount; i++) {
      const centroid = new Centroid();

      words.forEach(a => centroid.addWord(a, this.getRandomCountFor(a)));

      this._centroids.push(centroid);
    }
  }

  _calculateCentroids(aWords) {
    this._centroids.forEach(c => {
      aWords.forEach(w => {
        const totalWordCount = c._assignments
          .reduce((a, b) => a + b.getWordCountFor(w), 0);

        const avgWordCount = totalWordCount / c.length();

        c.addWord(w, avgWordCount);
      });
    });
  }

  _clearAssignments() {
    this._centroids.forEach(a => a.clear());
  }
}
