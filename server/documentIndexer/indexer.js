import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';
import SolrIndex from './indexes/solrIndex';
import LunrIndex from './indexes/lunrIndex';
import DocumentParser from './documentParser';

import { Documents } from '../../imports/database/documents/index';

export default class Indexer {
  static generateDocumentCollection(assetPath) {
    try {
      console.log('Generating Document Collection!');

      let files = glob.sync(path.join(assetPath, 'documents', '*.json')),
          total = files.length;

      files.forEach((file, idx, arr) => {
        var fn = path.basename(file);
        console.log('Reading document list file!', '[' + (idx+1) + '/' + total + ']', fn);

        var documentList = JSON.parse(fs.readFileSync(file));
        var total2 = documentList.length;

        documentList.forEach((doc, idx2, arr2) => {
          if (doc.route && doc.title && doc.test && doc.topic && doc.locale) {
            var docRoute = path.join(assetPath, doc.route);
            var fn = path.basename(doc.route);

            if (fs.existsSync(docRoute)) {
              var check = DocumentParser.cleanDocument(docRoute);

              var docObj = {};
              var parsedObj = DocumentParser.parseDocument(docRoute);

              // dgacitua: http://stackoverflow.com/a/171256
              for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
              for (var attrname in doc) { if(!Utils.isEmpty(doc[attrname])) docObj[attrname] = doc[attrname]; }

              var result = Documents.upsert({ route: docObj.route }, docObj);
                
              if (result.numberAffected > 0) console.log('Document indexed!', '[' + (idx2+1) + '/' + total2 + ']', fn);
              else console.error('Document errored!', '[' + (id2x+1) + '/' + total2 + ']', fn);
            }
            else {
              console.warn('File doesn\'t exist! Skipping!', fn);
            }
          }
          else {
            console.warn('Wrong document format detected in list');
          }
        });
      });

      return true;
    }
    catch (err) {
      console.error(err);
      throw new Meteor.Error('DocumentIndexingError', 'Cannot index documents!', err);
    }
  }

  static deleteOrphanDocuments(assetPath) {
    try {
      console.log('Removing listed documents without HTML file from database...');

      let syncedList = [];
      let files = glob.sync(path.join(assetPath, 'documents', '*.json'));

      files.forEach((file, idx, arr) => {
        var documentList = JSON.parse(fs.readFileSync(file));

        documentList.forEach((doc, idx2, arr2) => {
          var docRoute = path.join(assetPath, doc.route);
          if (fs.existsSync(docRoute)) syncedList.push(doc.route);
        });

        //var tempList = documentList.map((doc) => { return doc.route });
        //syncedList.push(...tempList);
      });

      Documents.remove({ route: { $nin: syncedList }});
      
      return true;
    }
    catch (err) {
      console.error(err);
      throw new Meteor.Error('DocumentIndexingError', 'Cannot delete orphan documents!', err);
    }
  }

  static loadInvertedIndex() {
    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.load((err, res) => {
        if (!err) return true;
        else return false;
      });
    }
    else {
      LunrIndex.load();
      return true;
    }
  }

  static generateInvertedIndex(callback) {
    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.generate((err, res) => {
        if (!err) return true;
        else return false;
      });
    }
    else {
      LunrIndex.generate();
      return true;
    }  
  }
}