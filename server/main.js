/*

NEURONE: oNlinE inqUiRy experimentatiON systEm
Copyright (C) 2017  Daniel Gacitua

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

import Indexer from './documentIndexer/indexer';
import DocumentDownloader from './documentIndexer/documentDownloader';
import ContentLoader from './contentLoader/contentLoader';

import ServerConfigs from './utils/serverConfigs';
import Utils from './utils/serverUtils';
import * as DB from './database/definitions';

Meteor.startup(() => {
  if (!Utils.isTesting()) {
    console.log('Welcome to NEURONE Server Platform!');
    const assetPath = Utils.getAssetPath();
    StaticServer.add('/assets', assetPath);

    // dgacitua: Start user presence monitor
    InstanceStatus.events.on('registerInstance', (id, record) => {
      console.log('Registered new NEURONE instance!', 'PID: ' + id.pid);
    });

    InstanceStatus.registerInstance('neurone');

    UserPresenceMonitor.start();
    UserPresence.start();

    // dgacitua: Creating download documents folder
    console.log('Creating download directory...');
    DocumentDownloader.createDownloadDirs();

    // dgacitua: Preloading of Form and Synthesis questions
    if (ServerConfigs.reloadProfilesOnDeploy) {
      console.log('Loading Settings and Profiles...');
      let step = ContentLoader.loadSettings(assetPath);
    }

    // dgacitua: Preloading of Form and Synthesis questions
    if (ServerConfigs.reloadQuestionsOnDeploy) {
      console.log('Loading Questions...');
      let step = ContentLoader.loadQuestions(assetPath);
    }  

    // dgacitua: Load HTML documents, parse them and index them
    if (ServerConfigs.reloadDocCollectionOnDeploy) {
      console.log('Generating Document Collection...');

      if (Indexer.checkOldDocumentDefinitions(assetPath)) {
        console.warn('Generating document collection with JSON Files (Fallback Mode)');
        let step1 = Indexer.generateDocumentCollection(assetPath),
            step2 = Indexer.deleteOrphanDocuments(assetPath);
      }
      
      let idx = Indexer.generateInvertedIndex();
    }
    else {
      let idx = Indexer.loadInvertedIndex();
    }

    console.log('NEURONE Server Platform is ready!');
  }
  else {
    console.log('Running NEURONE in Test mode!');
  }
});