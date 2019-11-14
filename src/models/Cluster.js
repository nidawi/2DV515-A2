import Blog from './Blog'; // eslint-disable-line

export default class Cluster {
  /**
   * Creates an instance of Cluster.
   * @param {Blog} [aBlog]
   * @param {Cluster} [aLeft]
   * @param {Cluster} [aRight]
   * @memberof Cluster
   */
  constructor(aBlog, aLeft, aRight) {
    /**
     * @type {Cluster}
     */
    this._right = aRight;
    /**
     * @type {Cluster}
     */
    this._left = aLeft;
    /**
     * @type {Blog}
     */
    this._blog = aBlog;
    /**
     * @type {number}
     */
    this._distance = 0;
    /**
     * @type {Cluster}
     */
    this._parent = undefined;
  }

  /**
   * Returns true if this cluster is a leaf node.
   * As in, it has no out-going edges.
   * @return {boolean}
   * @memberof Cluster
   */
  isLeaf() {
    return !this._left && !this._right;
  }

  /**
   * Returns true if this cluster is the parent of
   * two leaf nodes. As in, both out-going edges
   * connect to leaf nodes.
   * @return {boolean}
   * @memberof Cluster
   */
  isLeafParent() {
    return this._left.isLeaf() && this._right.isLeaf();
  }

  /**
   * Returns true if this cluster is a connector node.
   * As in, neither out-going edges connect to a leaf node
   * and this cluster acts as a bridge.
   * @return {boolean}
   * @memberof Cluster
   */
  isConnector() {
    return !this._left.isLeaf() && !this._right.isLeaf();
  }

  getType() {
    if (this.isLeaf() || this.isLeafParent()) {
      return 'leaf';
    } else if (this.isConnector()) {
      return 'connector';
    } else {
      return 'node';
    }
  }

  getBlog() {
    return this._blog;
  }

  setBlog(aBlog) {
    this._blog = aBlog;
  }

  setLeft(aLeft) {
    this._left = aLeft;
  }

  setRight(aRight) {
    this._right = aRight;
  }

  setParent(aParent) {
    this._parent = aParent;
  }

  setDistance(aDistance) {
    this._distance = aDistance;
  }

  /**
   * Returns a json represenation of this cluster and all its children.
   * @return {string|jsonLeafParent|jsonConnector|jsonNode}
   * @memberof Cluster
   */
  jsonify() {
    if (this.isLeaf()) {
      return this._blog._name;
    } else if (this.isLeafParent()) {
      return {
        type: this.getType(),
        blogs: [
          this._left.jsonify(),
          this._right.jsonify()
        ]
      };
    } else if (this.isConnector()) {
      return {
        type: this.getType(),
        next: [
          this._left.jsonify(),
          this._right.jsonify()
        ]
      };
    } else {
      const blog = this._left.isLeaf() ?
        this._left.jsonify() :
        this._right.jsonify();

      const next = this._left.isLeaf() ?
        this._right.jsonify() :
        this._left.jsonify();

      return {
        type: this.getType(),
        blog: blog,
        next: next
      };
    }
  }

  /**
   * Returns a jsontree-friendly representation of this cluster
   * and all its children. jsontree is a jQuery plugin used to display trees.
   * @return {jsontreeLeaf|jsontreeConnector|jsontreeNode}
   * @memberof Cluster
   */
  jstreeify() {
    if (this.isLeaf()) {
      return {
        text: this._blog._name,
        icon: false
      };
    } else if (this.isLeafParent() || this.isConnector()) {
      return {
        text: '',
        children: [
          this._left.jstreeify(),
          this._right.jstreeify()
        ]
      };
    } else {
      const blog = this._left.isLeaf() ?
        this._left.jstreeify() :
        this._right.jstreeify();

      const next = this._left.isLeaf() ?
        this._right.jstreeify() :
        this._left.jstreeify();

      return {
        text: '',
        children: [
          blog,
          next
        ]
      };
    }
  }
}

/**
 * @typedef jsonLeafParent
 * @type {Object}
 * @property {string} type
 * @property {string[]|jsonLeafParent[]|jsonConnector[]|jsonNode[]} blogs
 */

/**
 * @typedef jsonConnector
 * @type {Object}
 * @property {string} type
 * @property {string[]|jsonLeafParent[]|jsonConnector[]|jsonNode[]} next
 */

/**
 * @typedef jsonNode
 * @type {Object}
 * @property {string} type
 * @property {string} blog
 * @property {jsonLeafParent|jsonConnector|jsonNode} next
 */

/**
 * @typedef jsontreeLeaf
 * @type {Object}
 * @property {string} text
 * @property {boolean} icon
 */

/**
 * @typedef jsontreeConnector
 * @type {Object}
 * @property {string} text
 * @property {jsontreeLeaf[]|jsontreeConnector[]|jsontreeNode[]} children
 */

/**
 * @typedef jsontreeNode
 * @type {Object}
 * @property {string} text
 * @property {jsontreeLeaf[]|jsontreeConnector[]|jsontreeNode[]} children
 */
