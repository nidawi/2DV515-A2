import DataManager from '../models/DataManager'; // eslint-disable-line
import HierarchicalClustering from '../models/HierarchicalClustering'; // eslint-disable-line
import KMeansClustering from '../models/KMeansClustering'; // eslint-disable-line
import createHttpError from 'http-errors';

/**
 * @type {HierarchicalClustering}
 */
let hierarchicalClustering;
/**
 * @type {KMeansClustering}
 */
let kMeansClustering;

/**
 * @param {string} aMethod
 * @return {HierarchicalClustering|KMeansClustering}
 */
const getClusteringMethod = (aMethod) => {
  switch ((aMethod || '').toLowerCase()) {
  case 'hierarchical': case 'hierarch':
    return hierarchicalClustering;
  case 'kmeans': case 'k-means':
    return kMeansClustering;
  default:
    throw createHttpError(400, 'Invalid Clustering Method');
  }
};

/**
 * @param {HierarchicalClustering|KMeansClustering} aClusteringMethod
 * @param {string} aOutputFormat
 * @return {*}
 */
const convertReturnType = (aClusteringMethod, aOutputFormat) => {
  if (aOutputFormat === 'jstree') {
    return aClusteringMethod.getAsJsTree();
  } else {
    return aClusteringMethod.getAsJson();
  }
};

/**
 * @export
 * @param {HierarchicalClustering} aHierarchicalMethod
 * @param {KMeansClustering} aKMeansMethod
 */
export function setClusteringMethods(aHierarchicalMethod, aKMeansMethod) {
  hierarchicalClustering = aHierarchicalMethod;
  kMeansClustering = aKMeansMethod;
}

/**
 * @export
 * @param {'hierarchical'|'hierarch'|'kmeans'|'k-means'} aMethod
 * @param {'jstree'|'json'} aOutputFormat
 * @param {number} aIterationCount
 * @param {number} aClusterCount
 * @return {*}
 */
export async function getClusteringResult(aMethod,
  aOutputFormat, aIterationCount, aClusterCount) {
  const clusteringMethod = getClusteringMethod(aMethod);
  clusteringMethod.executeClustering(aClusterCount, aIterationCount);

  return convertReturnType(clusteringMethod, aOutputFormat);
}
