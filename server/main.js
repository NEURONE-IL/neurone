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

    // dgacitua: Preloading of Form and Synthesis questions
    if (ServerConfigs.reloadProfilesOnDeploy) {
      console.log('Loading Settings and Profiles...');
      let fn = Meteor.wrapAsync(ContentLoader.loadSettings),
        step = fn(assetPath);
    }

    // dgacitua: Preloading of Form and Synthesis questions
    if (ServerConfigs.reloadQuestionsOnDeploy) {
      console.log('Loading Questions...');
      let fn = Meteor.wrapAsync(ContentLoader.loadQuestions),
        step = fn(assetPath);
    }  

    // dgacitua: Load HTML documents, parse them and index them
    if (ServerConfigs.reloadDocCollectionOnDeploy) {
      console.log('Generating Document Collection...');

      let fn1 = Meteor.wrapAsync(Indexer.generateDocumentCollection),
          fn2 = Meteor.wrapAsync(Indexer.deleteOrphanDocuments),
          fn3 = Meteor.wrapAsync(Indexer.generateInvertedIndex);

      let step1 = fn1(assetPath),
          step2 = fn2(assetPath),
          step3 = fn3();
    }
    else {
      let fn = Meteor.wrapAsync(Indexer.loadInvertedIndex),
        step = fn();
    }
  }
  
  console.log('NEURONE Server Platform is ready!');
});