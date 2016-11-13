import ServerConfigs from './serverConfigs';
import Utils from './lib/utils';
import Indexer from './documentIndexer/indexer';
import ContentLoader from './contentLoader/contentLoader';

Meteor.startup(function () {
  console.log('Welcome to NEURONE Server Platform!');
  const assetPath = Utils.getAssetPath();

  // dgacitua: Preloading of Form and Synthesis questions
  console.log('Loading Questions...');
  ContentLoader.loadQuestions(assetPath);

  // dgacitua: Load HTML documents, parse them and index them
  if (ServerConfigs.reloadDocCollectionOnDeploy) {
    if (Indexer.getDocumentCount() === 0) {
      //console.log('Generating Document Collection...');
      Indexer.generateDocumentCollection(assetPath);
    }
    else {
      //console.log('Updating Document Collection...');
      Indexer.updateDocumentCollection(assetPath);
    }
  }
  else {
    Indexer.loadInvertedIndex();
  }

  console.log('NEURONE Server Platform is ready!');
  StaticServer.add('/', assetPath);
});