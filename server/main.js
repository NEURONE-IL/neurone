import { Meteor } from 'meteor/meteor';

import ServerMethods from './serverMethods';
import DatabaseMethods from './databaseMethods';
import SearchMethods from './searchMethods';

import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';

Meteor.startup(function () {
  console.log('Loading Documents...');

  if (Documents.find().count() === 0) {  
    const loadedDocuments = JSON.parse(Assets.getText('reuters100.json'));

    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
    });

    console.log('Documents Loaded!');
  }
  else {
    console.log('Documents Already Loaded!');


    //DocumentParserService.removeLinks(string);

  }
});