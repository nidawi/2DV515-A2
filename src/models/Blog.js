export default class Blog {
  /**
   * Creates an instance of Blog.
   * @param {string} [aBlogName]
   * @param {string []} [aWords]
   * @param {number[]} [aWordCounts]
   * @memberof Blog
   */
  constructor(aBlogName, aWords, aWordCounts) {
    /**
     * @type {string}
     */
    this._name = aBlogName;
    /**
     * @type {Map<string, number>}
     */
    this._words = new Map();

    if (aWords && aWordCounts) {
      aWords.forEach((a, i) => {
        this.setWord(a, aWordCounts[i]);
      });
    }
  }

  setWord(aWord, aWordCount) {
    this._words.set(aWord, aWordCount);
  }

  getUniqueWords() {
    return [...this._words.keys()];
  }

  getTotalWordCount() {
    return [...this._words.values()]
      .reduce((a, b) => a + b, 0);
  }

  getWordCountFor(aWord) {
    return this._words.get(aWord);
  }
}
