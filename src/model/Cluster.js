import Blog from './Blog'; // eslint-disable-line

export default class Cluster {
  constructor() {
    /**
     * @type {Cluster}
     */
    this._right = undefined;
    /**
     * @type {Cluster}
     */
    this._left = undefined;
    /**
     * @type {Blog}
     */
    this._blog = undefined;
    /**
     * @type {number}
     */
    this._distance = undefined;
  }
}
