import Blog from './Blog'; // eslint-disable-line
import Cluster from './Cluster';

/**
 *
 *
 * @export
 * @class ClusterManager
 */
export default class ClusterManager {
  /**
   * Creates an instance of ClusterManager.
   * @param {Blog[]} aBlogs
   * @memberof ClusterManager
   */
  constructor(aBlogs) {

    this._blogs = aBlogs;
    
    this._clusters = [];

    // Generate initial clusters
    this._clusters = this._blogs.map(a => new Cluster());
    
  }

  getClusterCount() {
    return this._clusters.length;
  }
}
