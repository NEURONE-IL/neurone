import InvertedIndexService from '../imports/components/search/services/invertedIndex';
import DocumentParserService from '../imports/components/search/services/documentParser';

import { Documents } from '../imports/api/documents/index';

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
  },
  getPageAsset: function(path) {
    check(path, String);

    const dpService = DocumentParserService;

    var html = dpService.getTextAsset(path);
    //var json = dpService.html2json(html);

    return html;
  },
  getBinaryAsset: function(path) {
    check(path, String);

    const dpService = DocumentParserService;

    var bin = dpService.getBinaryAsset(path);

    return html;
  }
});