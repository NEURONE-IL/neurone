import { Meteor } from 'meteor/meteor';

//import * as index from './lib/solrRequest';

import DatabaseMethods from './databaseMethods';
import SearchMethods from './searchMethods';

import { Documents } from '../imports/api/documents/index';

Meteor.startup(function () {
  if (Documents.find().count() === 0) {
    console.log('Loading Documents...');
    const loadedDocuments = JSON.parse(Assets.getText('reuters100.json'));

    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
    })
  }
  else {
    console.log('Documents Loaded!');
  }
});