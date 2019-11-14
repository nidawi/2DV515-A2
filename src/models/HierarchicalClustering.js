import Blog from './Blog'; // eslint-disable-line
import DataManager from './DataManager'; // eslint-disable-line
import Cluster from './Cluster';
import pearson from '../lib/Pearson';
import { writeFileSync } from 'fs';

// todo: consider performance improvements (if time)
export default class HierarchicalClustering {
  /**
   * Creates an instance of HierarchicalClustering.
   * @param {DataManager} aDataMgr
   * @memberof HierarchicalClustering
   */
  constructor(aDataMgr) {
    this._dataMgr = aDataMgr;
    /**
     * @type {Cluster[]}
     */
    this._clusters = aDataMgr.getBlogs()
      .map(a => new Cluster(a));

    // These two are for debug & trivia
    this._historicLength = this._clusters.length;
    this._historicIterations = 0;
    this._shouldReCalculate = true;
  }

  length() {
    return this._clusters.length;
  }

  isComplete() {
    return this.length() === 1;
  }

  getClusters() {
    return this._clusters.slice(0);
  }

  getCluster() {
    return this._clusters[0];
  }

  getAsJson() {
    return this.getCluster()
      .jsonify();
  }

  getAsJsTree() {
    return this.getCluster()
      .jstreeify();
  }

  /**
   * Dumps the current cluster data into
   * the specified file, aFile.
   * The output can be modified using the
   * converter function, aConvertFunc.
   * This function is given the cluster
   * as its first argument. Leave as
   * undefined to dump as json. Please
   * note that this dump is synchronous,
   * and the output will be stringified using
   * JSON.stringify().
   * See examples.
   * @example
   * dump(c => c.jstreeify()); // dumps cluster as jsontree hierarchy.
   * @param {CoverterFunction} [aConvertFunc]
   * @param {string} [aFile='./dump.json']
   * @memberof HierarchicalClustering
   */
  dump(aConvertFunc, aFile = './dump.json') {
    const cluster = this.getCluster();
    const output = aConvertFunc ?
      aConvertFunc(cluster) :
      cluster.jsonify();

    writeFileSync(
      aFile,
      JSON.stringify(output, null, 2));
  }

  /**
   * Executes clustering and calls
   * the callback once complete.
   * The result will not be returned.
   * Hierarchical clustering always
   * gives the same result, which is
   * why loading once is enough.
   * @param {Function} aCallback
   * @memberof HierarchicalClustering
   */
  preLoad(aCallback) {
    this.executeClustering();
    this._shouldReCalculate = false;
    aCallback();
  }

  /**
   * Executes the hierarchical clustering
   * procedure and returns the resulting
   * cluster.
   * @return {Cluster}
   * @memberof HierarchicalClustering
   */
  executeClustering() {
    if (!this._shouldReCalculate) {
      return this.getCluster();
    }

    this._historicIterations = 0;

    while (!this.isComplete()) {
      this.__iterate();
    }

    return this.getCluster();
  }

  /**
   * Performs one iteration.
   * @memberof HierarchicalClustering
   */
  __iterate() {
    this._historicIterations++;
    // find closest nodes...
    let closest = Number.MAX_VALUE;
    let clusterA = undefined;
    let clusterB = undefined;

    // O(n^2) right here
    this._clusters.forEach(cA => {
      this._clusters.forEach(cB => {
        if (cA !== cB) {
          const distance = pearson(cA.getBlog(), cB.getBlog());
          if (distance < closest) {
            closest = distance;
            clusterA = cA;
            clusterB = cB;
          }
        }
      });
    });

    const newCluster = this.__mergeClusters(clusterA, clusterB, closest);

    this._clusters = this._clusters
      .filter(a => a !== clusterA && a !== clusterB);

    this._clusters.push(newCluster);
  }

  /**
   * Merges two clusters.
   * @param {Cluster} aClusterA
   * @param {Cluster} aClusterB
   * @param {number} aDistance
   * @return {Cluster}
   * @memberof HierarchicalClustering
   */
  __mergeClusters(aClusterA, aClusterB, aDistance) {
    // new cluster + setup
    const newCluster = new Cluster(undefined, aClusterA, aClusterB);
    aClusterA.setParent(newCluster);
    aClusterB.setParent(newCluster);

    // merge blog
    const newBlog = this.__mergeBlogs(aClusterA.getBlog(), aClusterB.getBlog());

    newCluster.setBlog(newBlog);
    newCluster.setDistance(aDistance);

    return newCluster;
  }

  /**
   * Merges two blogs.
   * @param {Blog} aBlogA
   * @param {Blog} aBlogB
   * @return {Blog}
   * @memberof HierarchicalClustering
   */
  __mergeBlogs(aBlogA, aBlogB) {
    const words = this._dataMgr.getWords();

    const newBlog = new Blog();
    words.forEach(w => {
      // do word-wise avg merge
      const countA = aBlogA.getWordCountFor(w);
      const countB = aBlogB.getWordCountFor(w);
      const avg = (countA + countB) / 2;

      newBlog.setWord(w, avg);
    });

    return newBlog;
  }
}

/**
 * Optional convertion of dump output.
 * @callback CoverterFunction
 * @param {Cluster} aDumpCluster
 * @return {*}
 */
