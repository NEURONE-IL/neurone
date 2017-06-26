import SolrIndex from '../documentIndexer/indexes/solrIndex';
import LunrIndex from '../documentIndexer/indexes/lunrIndex';
import DocumentRetrieval from '../documentIndexer/documentRetrieval';
import DocumentDownloader from '../documentIndexer/documentDownloader';

Meteor.methods({
  searchDocuments: function(queryObj) {
    try {
      check(queryObj, Object);

      if (process.env.NEURONE_SOLR_HOST) {
        var qo = queryObj,
          call = Meteor.wrapAsync(SolrIndex.searchDocuments),
           res = call(qo);

        if (res.length >= 1) return DocumentRetrieval.iFuCoSort(res, 3, 2);
        else return res;
      }
      else {
        var qo = queryObj,
          res1 = LunrIndex.searchDocuments(qo.query),
          res2 = res1.filter((d) => { return d.locale === qo.locale && d.test.indexOf(qo.test) !== -1 && d.topic.indexOf(qo.topic) !== -1 });

        if (res2.length >= 1) return DocumentRetrieval.iFuCoSort(res2, 3, 2);
        else return res2;
      }
    }
    catch (err) {
      throw new Meteor.Error(571, 'Cannot search documents from query', err);
    }
  },
  getDocument: function(documentName) {
    try {
      var asyncCall = Meteor.wrapAsync(DocumentRetrieval.getDocument),
                doc = asyncCall(documentName);

      return doc;
    }
    catch (err) {
      throw new Meteor.Error(572, 'Cannot get document for display', err);
    }
  }
});