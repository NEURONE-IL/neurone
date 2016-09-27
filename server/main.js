import { Meteor } from 'meteor/meteor';

import ServerMethods from './serverMethods';
import DatabaseMethods from './databaseMethods';
import SearchMethods from './searchMethods';

import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';

Meteor.startup(function () {
  console.log('Loading Documents...');

  if (Documents.find().count() === 0) {  
    /*
    const loadedDocuments = JSON.parse(Assets.getText('reuters100.json'));

    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
    });
    */

    const loadedDocuments = JSON.parse(Assets.getText('olympics.json'));

    loadedDocuments.forEach(function(doc) {
      Documents.insert(doc);
    });

    console.log('Documents Loaded!');
  }
  else {
    console.log('Documents Already Loaded!');
    
    var filePath = Meteor.absolutePath + '/public/olympic_games.html',
      htmlString = '';

    /*
    DocumentParserService.readTextFile(filePath, function(error, response) {
      if (!error) {
        htmlString = response;
        temp1 = DocumentParserService.removeLinks(htmlString);
        newPath = Meteor.absolutePath + '/public/olympic_games2.html';
        DocumentParserService.writeTextFile(newPath, temp1);
      }
      else {
        console.log(err);
      }
    });
    */
  }
});