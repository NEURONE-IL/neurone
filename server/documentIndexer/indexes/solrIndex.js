import SolrNode from 'solr-node';

import Utils from '../../lib/utils';

import { Documents } from '../../../imports/api/documents/index';

let searchIndex;

export default class SolrIndex {
  static load() {
    var options = {
      host: process.env.NEURONE_SOLR_HOST || 'localhost',
      port: process.env.NEURONE_SOLR_PORT || '8983',
      core: process.env.NEURONE_SOLR_CORE || 'neurone',
      debugLevel: 'ERROR'
    }

    searchIndex = new SolrNode(options);

    searchIndex.ping((err, res) => {
      if (!err) {
        console.log('Solr index loaded successfully');
      }
    });
  }

  static generate() {
    this.load();

    var docs = Documents.find().fetch(),
     idxDocs = [];
      idxCnt = 0,
      idxErr = 0;

    
    docs.forEach((doc, idx) => {
      var newDoc = {
        id: doc._id,
        docId_s: doc._id,
        locale_s: doc.locale,
        relevant_b: doc.relevant || false,
        title_t: doc.title || '',
        body_t: doc.body || '',
        indexedBody_t: this.escapeString(doc.indexedBody) || '',
        keywords_s: doc.keywords || []
      };

      idxDocs.push(newDoc);
    });

    // dgacitua: Deleting old documents
    searchIndex.delete({ '*':'*' }, (err, res) => {
      if (!err) {
        // dgacitua: Adding new documents
        searchIndex._requestPost('update?commit=true', idxDocs, {}, (err2, res2) => {
          if (!err2) {
            console.log('Documents added to Solr Index!');
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

  static searchDocuments(queryText, callback) {
    check(queryText, String);

    var q1 = 'q=' + 'title_t:' + queryText + ' OR ' + 'indexedBody_t:' + queryText,
        q2 = 'df=indexedBody_t',
        q3 = 'hl=on&hl.fl=indexedBody_t&hl.snippets=3&hl.simple.pre="&hl.simple.post="',
        q4 = 'hl.fragmenter=regex&hl.regex.slop=0.2&hl.alternateField=body_t&hl.maxAlternateFieldLength=300&wt=json',
     query = q1 + '&' + q2 + '&' + q3 + '&' + q4;

    var respDocs = [];

    searchIndex.search(query, Meteor.bindEnvironment((err, res) => {
      if (!err) {
        var searchResponse = res,
                 searchNum = searchResponse.response.numFound,
                searchDocs = searchResponse.response.docs,
                  searchHl = searchResponse.highlighting;
        
        searchDocs.forEach((doc) => {
          var docId = doc.id,
             docObj = Documents.findOne({_id: docId});

          docObj.body = '';

          // Underscore.js iterate object
          //_.each(searchHl[docId], function(value, key) {
          //  docObj.body += value[0];
          //});

          searchHl[docId].indexedBody_t.forEach((snip, idx, arr) => {
            docObj.body += snip;
            if (idx < arr.length-1) docObj.body += ' ... ';
          });

          delete docObj.indexedBody;
          
          respDocs.push(docObj);
        });

        callback(null, respDocs);
      }
      else {
        console.error(err);
        callback(err);
      }
    }));
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

  static getVarType(obj) {
    // dgacitua: http://stackoverflow.com/a/28475765
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
  }
}