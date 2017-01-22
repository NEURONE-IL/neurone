import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';
import SolrIndex from './indexes/solrIndex';
import LunrIndex from './indexes/lunrIndex';
import DocumentParser from './documentParser';

import { Documents } from '../../imports/api/documents/index';

export default class Indexer {
  static generateDocumentCollection(assetPath, callback) {
    try {
      console.log('Generating Document Collection!');

      var syncedList = [];
      var documentList = JSON.parse(fs.readFileSync(path.join(assetPath, 'documents.json')));
      var total = documentList.length;

      documentList.forEach((doc, idx, arr) => {
        var fn = path.basename(doc.route);
        //console.log('Indexing documents...', fn, (idx+1) + ' of ' + total);

        var docRoute = path.join(assetPath, doc.route);

        var check = DocumentParser.cleanDocument(docRoute);

        var docObj = {};
        var parsedObj = DocumentParser.parseDocument(docRoute);

        // dgacitua: http://stackoverflow.com/a/171256
        for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
        for (var attrname in doc) { if(!Utils.isEmpty(doc[attrname])) docObj[attrname] = doc[attrname]; }

        Documents.upsert({ route: docObj.route }, docObj, (err, res) => {
          if (!err)  {
            syncedList.push(docObj.route);
            console.log('Document indexed!', '[' + (idx+1) + '/' + total + ']', fn);
          }
          else {
            console.error('Document errored!', '[' + (idx+1) + '/' + total + ']', fn, err);
            callback(err);
          }
        });

        if (idx === arr.length-1) callback(null, true);
      });
    }
    catch (err) {
      throw new Meteor.Error('DocumentIndexingError', 'Cannot index documents!', err);
    }
  }

  static deleteOrphanDocuments(assetPath, callback) {
    try {
      console.log('Removing listed documents without HTML file from database...');

      var documentList = JSON.parse(fs.readFileSync(path.join(assetPath, 'documents.json')));
      var syncedList = documentList.map((doc) => { return doc.route });

      Documents.remove({ route: { $nin: syncedList }}, (err, res) => {
        if (!err) {
          callback(null, true);
        }
        else {
          callback(err);
        }
      });
    }
    catch (err) {
      throw new Meteor.Error('DocumentIndexingError', 'Cannot delete orphan documents!', err);
    }
  }

  static loadInvertedIndex(callback) {
    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.load((err, res) => {
        if (!err) callback(null, true);
        else callback(err);
      });
    }
    else {
      LunrIndex.load();
      callback(null, true);
    }
  }

  static generateInvertedIndex(callback) {
    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.generate((err, res) => {
        if (!err) callback(null, true);
        else callback(err);
      });
    }
    else {
      LunrIndex.generate();
      callback(null, true);
    }  
  }
}