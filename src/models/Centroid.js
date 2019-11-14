import Blog from './Blog'; //eslint-disable-line

export default class Centroid {
  /**
   * Creates an instance of Centroid.
   * @param {string} [aCentroidId] Optional centroid id.
   * @memberof Centroid
   */
  constructor(aCentroidId) {
    /**
     * @type {Map<string, number>}
     */
    this._words = new Map();
    /**
     * @type {Blog[]}
     */
    this._assignments = [];
    /**
     * @type {Blog[]}
     */
    this._previousAssignment = [];
    this._id = aCentroidId;
    this._isFinished = false;
  }

  isFinished() {
    return this._isFinished;
  }

  /**
   * Checks whether this cluster could be considered finished.
   * The result is reflected by isFinished().
   * @memberof Centroid
   */
  checkFinished() {
    // Checks if the current assignments are equal to the previous assignments.
    // We are dealing with objects, so object reference equality is appropriate.
    // Length also has to be the same. Array.equals does not work due to order.
    this._isFinished =
      this._assignments.length === this._previousAssignment.length &&
      this._assignments.every(a => this._previousAssignment.find(b => b === a));

    // Copy the current assignments into the stored assignments.
    if (!this.isFinished()) {
      this._previousAssignment = this._assignments.slice(0);
    }
  }

  length() {
    return this._assignments.length;
  }

  addWord(aWord, aCount) {
    this._words.set(aWord, aCount);
  }

  assign(aBlog) {
    this._assignments.push(aBlog);
  }

  clear() {
    this._assignments = [];
  }

  getUniqueWords() {
    return [...this._words.keys()];
  }

  getWordCountFor(aWord) {
    return this._words.get(aWord);
  }

  /**
   * Returns a JSON-friendly representation of this centroid
   * and its associated cluster.
   * @todo consider return format = only string[]
   * @return {{length:number, assignments:string[]}[]}
   * @memberof Centroid
   */
  jsonify() {
    return {
      length: this.length(),
      assignments: this._assignments
        .map(a => a._name)
    };
  }

  /**
   * Returns a jsontree-friendly representation of this centroid
   * and its associated cluster.
   * jsontree is a jQuery plugin used to display trees.
   * @return {jsontreeCentroid}
   * @memberof Centroid
   */
  jstreeify() {
    return {
      text: this._id || '',
      children: this._assignments
        .map(a => ({
          text: a._name,
          icon: false
        }))
    };
  }
}

/**
 * @typedef jsontreeCentroid
 * @type {Object}
 * @property {string} text
 * @property {jsontreeCentroidChild[]} children
 */

/**
 * @typedef jsontreeCentroidChild
 * @type {Object}
 * @property {string} text
 * @property {boolean} icon
 */
