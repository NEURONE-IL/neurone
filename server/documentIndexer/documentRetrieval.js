import SolrIndex from './indexes/solrIndex';
import LunrIndex from './indexes/lunrIndex';

const InvertedIndex = (process.env.NEURONE_SOLR_HOST) ? SolrIndex : LunrIndex;
export default InvertedIndex;

Meteor.methods({
  searchDocuments: function(query) {
    try {
      var results = InvertedIndex.searchDocuments(query);

      if (results.length >= 1) {
        return InvertedIndex.iFuCoSort(results, 3, 2);
      }
      else {
        return results;
      }  
    }
    catch (err) {
      throw new Meteor.Error('DocumentRetrievalError', 'Cannot get documents from query', err);
    }
  },
  getDocument: function(documentName) {
    try {
      var asyncCall = Meteor.wrapAsync(InvertedIndex.getDocument),
                doc = asyncCall(documentName);

      return doc;
    }
    catch (err) {
      throw new Meteor.Error('DocumentRetrievalError', 'Cannot get document for display', err);
    }
  }
});