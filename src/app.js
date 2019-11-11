// Trying Google's code style this time.
import DataManager from './model/DataManager';
import KMeansClustering from './model/KMeansClustering';

const BLOG_FILE = 'blogdata.txt';
const dataManager = new DataManager(BLOG_FILE);

dataManager.on('done', () => {
  console.log('Done!');

  const kMeansClustering = new KMeansClustering(dataManager);
  const smart = kMeansClustering.executeClustering(undefined, false);
  const normal = kMeansClustering.executeClustering(undefined);

  console.log(smart.map(a => a.jsonify()));
  console.log(normal.map(a => a.jsonify()));
});
