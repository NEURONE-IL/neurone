import lunr from 'lunr';

import Utils from '../lib/utils';

import { Documents } from '../../imports/api/documents/index';
import { Indexes } from '../../imports/api/indexes/index';

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

    this.save();
  }

  static load() {
    var currentIndex = Indexes.findOne({ type: 'LunrIndex', version: 1 }, { sort: { DateTime: -1 }});

    if (!Utils.isEmptyObject(currentIndex)) {
      console.log('Loading Inverted Index...');
      searchIndex = lunr.Index.load(JSON.parse(currentIndex.index));
    }
    else {
      this.generate();
    }
  }

  static save() {
    console.log('Saving Inverted Index...');

    var serializedIndex = { type: 'LunrIndex', version: 1, index: JSON.stringify(searchIndex) };

    Indexes.upsert({ type: 'LunrIndex', version: 1 }, serializedIndex);
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