import SolrNode from 'solr-node';

import Utils from '../../lib/utils';

import { Documents } from '../../../imports/api/documents/index';

let searchIndex;

export default class SolrIndex {
  static start() {
    var options = {
      host: process.env.NEURONE_SOLR_HOST || 'localhost',
      port: process.env.NEURONE_SOLR_PORT || '8983',
      core: process.env.NEURONE_SOLR_CORE || 'neurone',
      debugLevel: 'ERROR'
    }

    searchIndex = new SolrNode(options);

    searchIndex.ping((err, res) => {
      if (!err) {
        console.log('Solr Index created successfully');
      }
    });
  }

  static generate() {
    this.start();

    var docs = Documents.find().fetch(),
     idxDocs = [];
      idxCnt = 0,
      idxErr = 0;

    
    docs.forEach((doc, idx) => {
      var newDoc = {
        id: doc._id,
        docId_s: doc._id,
        relevant_b: doc.relevant,
        title_t: doc.title,
        body_t: doc.body,
        indexedBody_t: this.escapeString(doc.indexedBody)
      };

      idxDocs.push(newDoc);
    });

    // dgacitua: Deleting old documents
    searchIndex.delete({ '*':'*' }, (err, res) => {
      if (!err) {
        // dgacitua: Adding new documents
        searchIndex._requestPost('update?commit=true', idxDocs, {}, (err2, res2) => {
          if (!err2) {
            console.log('Documents added to Solr Index!', res2.responseHeader);
          }
          else {
            console.error('Error while adding documents to Solr Index', err2);
          }
        });
        /*
        // dgacitua: Adding new documents
        docs.forEach((doc, idx, arr) => {
          // dgacitua: Need to set timeout to avoid saturating Solr Index
          setTimeout(() => {
            searchIndex.update(doc, (err2, res2) => {
              if (!err2) idxCnt++;
              else idxErr++;
            });
          }, this.randomInteger(50,100));

          if (idxCnt+idxErr === arr.length) {
            console.log('Documents indexed in Solr!', 'OK:' + idxCnt, 'ERROR:' + idxErr);    
          }
        });
        */
      }
      else {
        console.error('Error while removing old documents from Solr Index', err);
      }
    });
  }

  static searchDocuments(queryText) {
    try {
      check(queryText, String);

      var query = searchIndex.query()
                    .q('title_t:' + queryText + ' OR ' + 'indexedBody_t:' + queryText)
                    .dismax()
                    .df('indexedBody_t')
                    .hlQuery({fl: 'indexedBody_t', snippets: 3, alternateField: 'body_t'}),
         search = Meteor.wrapAsync(searchIndex.search),
        results = search(query);

      console.log('results', res);
      return results;
    }
    catch (err) {
      throw new Meteor.Error('SearchError', 'Could not get search results for query', err);
    }
  }

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


  static randomInteger(low, high) {
    // dgacitua: https://blog.tompawlak.org/generate-random-values-nodejs-javascript
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  static escapeString(str) {
    // dgacitua: http://stackoverflow.com/a/9204218
    return str
      .replace(/[\\]/g, ' ')
      .replace(/[\"]/g, ' ')
      .replace(/[\/]/g, ' ')
      .replace(/[\b]/g, ' ')
      .replace(/[\f]/g, ' ')
      .replace(/[\n]/g, ' ')
      .replace(/[\r]/g, ' ')
      .replace(/[\t]/g, ' ');
  }
}