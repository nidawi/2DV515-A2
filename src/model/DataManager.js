import { EventEmitter } from 'events';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import Blog from './Blog';

/**
 * @export
 * @class TSVParser
 * @extends {EventEmitter}
 */
export default class DataManager extends EventEmitter {
  constructor(aFilePath) {
    super();

    /**
     * @todo merge into _getFileContents()
     */
    this._fileReader = undefined;
    /**
     * @type {string[]}
     */
    this._headers = [];
    /**
     * @type {Map<string, Blog>}
     */
    this._entries = new Map();

    this._loadFileAsync(aFilePath);
  }

  getBlogNames() {
    return [...this._entries.keys()];
  }

  getBlogCount() {
    return this._entries.size;
  }

  getBlog(aValueKey) {
    return this._entries.get(aValueKey);
  }

  getBlogs() {
    return [...this._entries.values()];
  }

  getWordCount() {
    return this._headers.length;
  }

  getWords() {
    return this._headers.slice(0);
  }

  async _loadFileAsync(aFilePath) {
    this._fileReader = createInterface({
      input: createReadStream(aFilePath)
    });

    const contents = await this._getFileContents();

    // Slice off the "blog"
    this._headers = contents
      .shift()
      .slice(1);

    contents.forEach(a => {
      this._entries.set(a[0],
        this._generateBlog(a[0],
          a
            .slice(1)
            .map(b => parseInt(b)))
      );
    });

    this.emit('done');
  }

  _getFileContents() {
    return new Promise((resolve, reject) => {
      const readContent = [];

      this._fileReader.on('line', line => {
        readContent.push(line.split('\t'));
      });
      this._fileReader.on('close', () => {
        resolve(readContent);
      });
    });
  }

  _generateBlog(aKey, aValues) {
    return new Blog(
      aKey,
      this._headers,
      aValues
    );
  }
}
