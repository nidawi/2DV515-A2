// Trying Google's code style this time.
import DataManager from './models/DataManager';
import { setClusteringMethods } from './controllers/apiController';
import HierarchicalClustering from './models/HierarchicalClustering';
import KMeansClustering from './models/KMeansClustering';
import server from './config/server';

const port = process.env.PORT || 3000;
const BLOG_FILE = 'blogdata.txt';
const dataManager = new DataManager(BLOG_FILE);

dataManager.on('done', () => {
  console.log(`${BLOG_FILE} has been loaded!`);

  // init clustering methods
  const hierarchicalClustering = new HierarchicalClustering(dataManager);
  const kMeansClustering = new KMeansClustering(dataManager);

  // pre-load hierarchical clustering
  hierarchicalClustering.preLoad(() => {
    console.log('Hierarchical clustering pre-load complete!');

    // setup api
    setClusteringMethods(hierarchicalClustering, kMeansClustering);

    // start server
    server()
      .listen(port, () => {
        console.log('Server has been started.');
        console.log('Terminate using Ctrl-C.');
      });
  });
});
