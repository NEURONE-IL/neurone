import SolrIndex from './indexes/solrIndex';
import LunrIndex from './indexes/lunrIndex';

import { Documents } from '../../imports/api/documents/index';

export default class DocumentRetrieval {
  static getDocument(documentName, callback) {
    check(documentName, String);

    var doc = Documents.findOne({ _id: documentName });

    if (doc && doc._id && doc.route) {
      doc.routeUrl = '/' + doc.route;
      callback(null, doc);
    }
    else {
      var err = 'Document not found!';
      callback(err);
    }
  }

  // dgacitua: Custom sorting algorithm for iFuCo Project
  // PARAMS:  documentArray  Array with resulting documents from Lunr
  //          insertions     Algorithm will check from first to <insertions> position for relevant documents
  //          offset         Algorithm will insert a relevant document at this position (1 is first position)
  static iFuCoSort(documentArray, insertions, offset) {
    check(documentArray, Array);
    check(insertions, Number);
    check(offset, Number);

    // iFuCoSort v2
    var insertNum = documentArray.length < insertions ? documentArray.length : insertions,
        offsetPos = documentArray.length < offset ? documentArray.length : offset;

    for (var i=0; i<insertNum; i++) {
      if (documentArray[i].relevant === true) return documentArray;
    }

    for (var j=0; j<documentArray.length; j++) {
      if (documentArray[j].relevant === true) {
        documentArray.move(j, offsetPos-1);
        return documentArray;  
      }
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
}

Meteor.methods({
  searchDocuments: function(query) {
    try {
      if (process.env.NEURONE_SOLR_HOST) {
        var call = Meteor.wrapAsync(SolrIndex.searchDocuments),//(query, (err, res) => {
             res = call(query);

        if (res.length >= 1) return DocumentRetrieval.iFuCoSort(res, 3, 2);
        else return res;
      }
      else {
        var results = LunrIndex.searchDocuments(query);

        if (results.length >= 1) return DocumentRetrieval.iFuCoSort(results, 3, 2);
        else return results;
      }
    }
    catch (err) {
      throw new Meteor.Error('DocumentRetrievalError', 'Cannot search documents from query', err);
    }
  },
  getDocument: function(documentName) {
    try {
      var asyncCall = Meteor.wrapAsync(DocumentRetrieval.getDocument),
                doc = asyncCall(documentName);

      return doc;
    }
    catch (err) {
      throw new Meteor.Error('DocumentRetrievalError', 'Cannot get document for display', err);
    }
  }
});