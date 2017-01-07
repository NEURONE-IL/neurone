import ServerConfigs from './serverConfigs';
import Utils from './lib/utils';
import Indexer from './documentIndexer/indexer';
import ContentLoader from './contentLoader/contentLoader';

Meteor.startup(() => {
  console.log('Welcome to NEURONE Server Platform!');
  const assetPath = Utils.getAssetPath();
  StaticServer.add('/', assetPath);

  if (!Utils.isTesting()) {
    // dgacitua: Start user presence monitor
    InstanceStatus.events.on('registerInstance', (id, record) => {
      console.log('Registered new NEURONE instance!', 'PID: ' + id.pid);
    });

    InstanceStatus.registerInstance('neurone');

    UserPresenceMonitor.start();
    UserPresence.start();

    // dgacitua: Aux variables
    let docStatus;

    console.log('Loading Settings and Profiles...');
    ContentLoader.loadSettings(assetPath);

    // dgacitua: Preloading of Form and Synthesis questions
    console.log('Loading Questions...');
    if (ServerConfigs.reloadQuestionsOnDeploy) {
      ContentLoader.loadQuestions(assetPath);
    }  

    // dgacitua: Load HTML documents, parse them and index them
    if (ServerConfigs.reloadDocCollectionOnDeploy) {
      console.log('Generating Document Collection...');
      docStatus = Indexer.generateDocumentCollection(assetPath);
    }
    else {
      docStatus = Indexer.loadInvertedIndex();
    }  
  }
  
  console.log('NEURONE Server Platform is ready!');
});