import { Meteor } from 'meteor/meteor';

import Lunr from '../imports/lib/lunr';

import { Documents } from '../imports/api/documents/index';
import { Snippets } from '../imports/api/snippets/index';

Meteor.startup(function () {
  index = Lunr.createIndex();

  if (Documents.find().count() === 0) {
   const loadedDocuments = JSON.parse(Assets.getText('reuters100.json'));

    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
      Lunr.addToIndex(index, document);
    });
  }
  /*
  else {
    const loadedDocuments = JSON.parse(Assets.getText('reuters1.json'));

    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
      Lunr.addToIndex(index, document);
    });
  }
  */

  Meteor.methods({
    searchDocIndex: function(query) {
      check(query, String);
      var searchResults = Lunr.searchIndex(index, query);

      if (searchResults == null) {
        throw new Meteor.Error("search-null", "Search results are NULL");
      }
      return searchResults;
    }
  });
});