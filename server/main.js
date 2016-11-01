import ServerConfigs from './serverConfigs';
import Indexer from './documentIndexer/indexer';

import { FormQuestions } from '../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../imports/api/formQuestionnaires/index';

Meteor.startup(function () {
  console.log('Welcome to NEURONE Server Platform!');

  // dgacitua: Load HTML documents, parse them and index them
  if (ServerConfigs.reloadDocCollectionOnDeploy) {
    if (Indexer.getDocumentCount() === 0) {
      console.log('Generating Document Collection...');
      Indexer.generateDocumentCollection();
    }
    else {
      console.log('Updating Document Collection...');
      Indexer.updateDocumentCollection();
    }    
  }
  else {
    Indexer.loadInvertedIndex();
  }

  // dgacitua: Preloading of Form questions
  console.log('Loading Form Questions...');

  if (FormQuestions.find().count() === 0) {  
    const loadedQuestions = JSON.parse(Assets.getText('questions.json'));

    loadedQuestions.forEach(function(q) {
      FormQuestions.insert(q);
    });

    console.log('Questions Loaded!');
  }
  else {
    console.log('Questions Already Loaded!');
  }

  // dgacitua: Preloading of Form questionnaires
  console.log('Loading Form Questionnaires...');

  if (FormQuestionnaires.find().count() === 0) {  
    const loadedQuestionnaires = JSON.parse(Assets.getText('questionnaires.json'));

    loadedQuestionnaires.forEach(function(q) {
      FormQuestionnaires.insert(q);
    });

    console.log('Questionnaires Loaded!');
  }
  else {
    console.log('Questionnaires Already Loaded!');
  }

  console.log('NEURONE Server Platform is ready!');

  //Meteor.call('parseDocument', '/public/sawao_kato.html');
  //Meteor.call('testIndexer');
});