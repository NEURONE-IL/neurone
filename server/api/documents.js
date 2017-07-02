import DocumentRetrieval from '../documentIndexer/documentRetrieval';
import DocumentDownloader from '../documentIndexer/documentDownloader';

Meteor.methods({
  searchDocuments: function(queryObj) {
    try {
      check(queryObj, Object);
      return DocumentRetrieval.searchDocument(queryObj);
    }
    catch (err) {
      throw new Meteor.Error(571, 'Cannot search documents from query', err);
    }
  },
  getDocument: function(documentName) {
    try {
      check(documentName, String);

      var asyncCall = Meteor.wrapAsync(DocumentRetrieval.getDocument),
                doc = asyncCall(documentName);

      return doc;
    }
    catch (err) {
      throw new Meteor.Error(572, 'Cannot get document for display', err);
    }
  },
  fetchDocument: function(documentObj) {
    try {
      check(documentObj, Object);

      let asyncCall = Meteor.wrapAsync(DocumentDownloader.fetch),
              fetch = asyncCall(documentObj);

      return fetch;
    }
    catch (err) {
      throw new Meteor.Error(573, 'The server cannot fetch document from web', err);
    }
  },
  listAllDocuments: function() {
    try {
      return DocumentRetrieval.listAllDocuments();
    }
    catch (err) {
      throw new Meteor.Error(574, 'Cannot list all documents', err);
    }
  },
  deleteDocument: function(docId) {
    try {
      check(docId, String);
      return DocumentRetrieval.deleteDocument(docId);
    }
    catch (err) {
      throw new Meteor.Error(575, 'Cannot delete document', err);
    }
  }
});