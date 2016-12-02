import lunr from 'lunr';
import sum from 'sum';
import 'array.prototype.move';

import Utils from '../lib/utils';

import { Documents } from '../../imports/api/documents/index';
import { Indexes } from '../../imports/api/indexes/index';

var searchIndex = {};

export default class InvertedIndex {
  static generate() {
    console.log('Generating Inverted Index...');

    var allDocs = Documents.find({});
    
    searchIndex = lunr(function() {
      this.field('title', { boost: 2 })
      this.field('indexedBody')
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

      docObj.body = this.snippetGenerator(docObj.indexedBody, query);

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

  static snippetGenerator(text, keywords) {
    var opts = {
      corpus: text,
      nSentences: 3,
      nWords: 15,
      emphasise: keywords.split(' ')
    };

    var abstract = sum(opts),
         snippet = abstract.summary;

    return snippet;
  }

  // dgacitua: Custom sorting algorithm for iFuCo Project
  // PARAMS:  documentArray  Array with resulting documents from Lunr
  //          insertions     Algorithm will check from first to <insertions> position for relevant documents
  //          offset         Algorithm will insert a relevant document at this position (1 is first position)
  static iFuCoSort(documentArray, insertions, offset) {
    check(documentArray, Array);

    // iFuCoSort v2
    var insertNum = documentArray.length < insertions ? documentArray.length : insertions,
        offsetPos = documentArray.length < offset ? documentArray.length : offset;

    for (var i=0; i<insertNum; i++) {
      if (documentArray[i].relevant === true) return documentArray;
    }

    for (var j=0; j<documentArray.length; j++) {
      documentArray.move(j, offsetPos-1);
      return documentArray;
    }

    return documentArray;

    // iFuCoSort v1
    /*
    var relevantDocs = this.shuffleArray(Documents.find({ relevant: true }).fetch()),
           insertNum = relevantDocs.length < insertions ? relevantDocs.length : insertions,
           offsetNum = (documentArray.length < offset ? documentArray.length : offset) - 1;

    for (i=0; i<insertNum; i++) {
      var index = documentArray.indexOf(relevantDocs[i]);

      if (index != -1) {
        documentArray.move(index, offsetNum);
      }
      else {
        documentArray.splice(offsetNum, 0, relevantDocs[i]);
      }
    }

    return this.removeArrayDuplicates(a => a._id, documentArray);
    */
  }

  // dgacitua: Implemented Fisher-Yates Shuffle algorithm
  static shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // dgacitua: http://stackoverflow.com/a/32238794
  static removeArrayDuplicates(keyFn, array) {
    var mySet = new Set();
    return array.filter(function(x) {
      var key = keyFn(x), isNew = !mySet.has(key);
      if (isNew) mySet.add(key);
      return isNew;
    });
  }
}

Meteor.methods({
  searchDocuments: (query) => {
    var results = InvertedIndex.searchDocuments(query);

    if (results.length >= 1) {
      return InvertedIndex.iFuCoSort(results, 3, 1);
    }
    else {
      return results;
    }
  },
  getDocument: (documentName) => {
    return InvertedIndex.getDocument(documentName);
  }
});