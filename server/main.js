import { Meteor } from 'meteor/meteor';

import * as index from './lib/solrRequest';
import InvertedIndexService from '../imports/components/search/services/invertedIndex';
import DatabaseMethods from './databaseMethods';

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

  Meteor.methods({
    searchDocuments: function(query) {
      check(query, String);

      const idxService = InvertedIndexService;

      var allDocs = Documents.find({}),
              idx = idxService.createIndex(),
           search = [],
         respDocs = [];

      allDocs.forEach(function (doc) {
        idxService.addDocument(idx, doc);
      });

      search = idxService.searchDocument(idx, query);
      
      search.forEach(function (obj) {
        var docId = obj.ref,
           docObj = Documents.findOne({id: docId});

        respDocs.push(docObj);
      });

      return respDocs;
    }
  });
});