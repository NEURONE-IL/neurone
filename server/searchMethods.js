import InvertedIndexService from '../imports/components/search/services/invertedIndex';
import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';

var idxService = InvertedIndexService,
   searchIndex = {};

Meteor.methods({
  createSearchIndex: () => {
    console.log('Generating Search Index...');

    var allDocs = Documents.find({});
    
    searchIndex = idxService.createIndex();

    allDocs.forEach((doc) => {
      idxService.addDocument(searchIndex, doc);
    });
  },
  searchDocuments: (query) => {
    check(query, String);

    var search = [],
      respDocs = [];

    search = idxService.searchDocument(searchIndex, query);
    
    search.forEach((obj) => {
      var docId = obj.ref,
         docObj = Documents.findOne({id: docId});

      respDocs.push(docObj);
    });

    return respDocs;
  },
  /*
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
  },
  */
  getPageAsset: (path) => {
    check(path, String);

    const dpService = DocumentParserService;

    var html = dpService.getTextAsset(path);
    //var json = dpService.html2json(html);

    return html;
  },
  getBinaryAsset: (path) => {
    check(path, String);

    const dpService = DocumentParserService;

    var bin = dpService.getBinaryAsset(path);

    return bin;
  },
  getAssetPath: (path) => {
    check(path, String);

    const dpService = DocumentParserService;

    var path = dpService.getAbsolutePath(path);

    return path;
  },
  getDocumentPage: (documentName) => {
    var doc = Documents.findOne({ docName: documentName }),
      route = doc.route;

    return '/' + route;
  }
});