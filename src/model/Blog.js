export default class Blog {
  constructor(aBlogName, aWords, aWordCounts) {
    /**
     * @type {string}
     */
    this._name = aBlogName;
    /**
     * @type {Map<string, number>}
     */
    this._values = new Map();

    aWords.forEach((a, i) => {
      this._values.set(a, aWordCounts[i]);
    });
  }

  getUniqueWords() {
    return [...this._values.keys()];
  }

  getTotalWordCount() {
    return [...this._values.values()]
      .reduce((a, b) => a + b, 0);
  }

  getWordCountFor(aWord) {
    return this._values.get(aWord);
  }
}
