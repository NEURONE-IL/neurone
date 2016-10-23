import { Meteor } from 'meteor/meteor';

//import ServerMethods from './serverMethods';
//import DatabaseMethods from './databaseMethods';
//import SearchMethods from './searchMethods';

//import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';
import { FormQuestions } from '../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../imports/api/formQuestionnaires/index';

Meteor.startup(function () {
  console.log('Welcome to NEURONE Server Platform!');

  // dgacitua: Preloading of HTML documents
  console.log('Loading Documents...');

  if (Documents.find().count() === 0) {  
    const loadedDocuments = JSON.parse(Assets.getText('olympics.json'));

    loadedDocuments.forEach(function(doc) {
      Documents.insert(doc);
    });

    console.log('Documents Loaded!');
    Meteor.call('createSearchIndex');
  }
  else {
    console.log('Documents Already Loaded!');
    Meteor.call('createSearchIndex');
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

  console.log('NEURONE Server Platform is ready!')
});