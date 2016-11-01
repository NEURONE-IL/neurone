import { lunr } from 'meteor/lbee:lunr';

import ServerUtils from '../lib/utils';

import { Documents } from '../../imports/api/documents/index';

var searchIndex = {};

export default class InvertedIndex {
  static generate() {
    console.log('Generating Inverted Index...');

    var allDocs = Documents.find({});
    
    searchIndex = lunr(function() {
      this.field('title', { boost: 3 })
      this.field('indexedBody')
      this.field('topics', { boost: 2 })
    });

    allDocs.forEach((doc) => {
      searchIndex.add(doc);
    });
  }

  static searchDocuments(query) {
    check(query, String);

    var search = [],
      respDocs = [];

    search = searchIndex.search(query);
    
    search.forEach((obj) => {
      var docId = obj.ref,
         docObj = Documents.findOne({id: docId});

      respDocs.push(docObj);
    });

    return respDocs;
  }

  static getDocument(documentName) {
    check(documentName, String);

    var doc = Documents.findOne({ docName: documentName });
    doc.routeUrl = '/' + doc.route;

    return doc;
  }
}

Meteor.methods({
  searchDocuments: (query) => {
    return InvertedIndex.searchDocuments(query);
  },
  getDocument: (documentName) => {
    return InvertedIndex.getDocument(documentName);
  }
});