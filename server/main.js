import ServerConfigs from './serverConfigs';
import Utils from './lib/utils';
import Indexer from './documentIndexer/indexer';
import ContentLoader from './contentLoader/contentLoader';

Meteor.startup(() => {
  console.log('Welcome to NEURONE Server Platform!');
  const assetPath = Utils.getAssetPath();

  // dgacitua: Start user presence monitor
  InstanceStatus.events.on('registerInstance', (id, record) => {
    console.log('Registered new NEURONE instance!', 'PID: ' + id.pid);
  });

  InstanceStatus.registerInstance('neurone');

  UserPresenceMonitor.start();
  UserPresence.start();

  // dgacitua: Aux variables
  let questionStatus, docStatus;

  // dgacitua: Preloading of Form and Synthesis questions
  console.log('Loading Questions...');
  if (ServerConfigs.reloadQuestionsOnDeploy) {
    questionStatus = ContentLoader.loadQuestions(assetPath);  
  }  

  // dgacitua: Load HTML documents, parse them and index them
  if (ServerConfigs.reloadDocCollectionOnDeploy) {
    if (Indexer.getDocumentCount() === 0) {
      //console.log('Generating Document Collection...');
      docStatus = Indexer.generateDocumentCollection(assetPath);
    }
    else {
      //console.log('Updating Document Collection...');
      docStatus = Indexer.updateDocumentCollection(assetPath);
    }
  }
  else {
    docStatus = Indexer.loadInvertedIndex();
  }

  console.log('NEURONE Server Platform is ready!');
  StaticServer.add('/', assetPath);
});