import { Meteor } from 'meteor/meteor';

import ServerMethods from './serverMethods';
import DatabaseMethods from './databaseMethods';
import SearchMethods from './searchMethods';

import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';

Meteor.startup(function () {
  console.log('Loading Documents...');
  var sm = SearchMethods;

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
});