import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';
import SolrIndex from './indexes/solrIndex';
import LunrIndex from './indexes/lunrIndex';
import DocumentParser from './documentParser';

import { Documents } from '../../imports/api/documents/index';

export default class Indexer {
  static generateDocumentCollection(assetPath) {
    console.log('Generating Document Collection!');

    var documentList = JSON.parse(fs.readFileSync(path.join(assetPath, 'documents.json')));
    var total = documentList.length;

    documentList.forEach((doc, idx) => {
      console.log('Indexing documents...', (idx+1) + ' of ' + total);

      var docRoute = path.join(assetPath, 'web', doc.route);

      DocumentParser.cleanDocument(docRoute);

      var docObj = {};
      var parsedObj = DocumentParser.parseDocument(docRoute);
      //var jsonObj = documentList.find(o => o.route === doc.route);

      // dgacitua: http://stackoverflow.com/a/171256
      for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
      for (var attrname in doc) { if(!Utils.isEmpty(doc[attrname])) docObj[attrname] = doc[attrname]; }

      // dgacitua: Underscore.js extend and merge
      //docObj = _.extend(docObj, jsonObj);
      //docObj = _.extend(docObj, parsedObj);
      
      docObj.route = path.join('web', docObj.route);

      Documents.upsert({ route: docObj.route }, docObj, (err, res) => {
        //if (!err) console.log('Document indexed!', (idx+1) + ' of ' + total);
      });
    });

    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.generate();
    }
    else {
      LunrIndex.generate();
    }

    // TODO Remove all documents

    /*
    glob(path.join(assetPath, '*.html'), Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Indexing documents...', (idx+1) + ' of ' + total);

          DocumentParser.cleanDocument(file);

          var docObj = {};
          var parsedObj = DocumentParser.parseDocument(file);
          var jsonObj = documentList.find(o => o.url === path.basename(file));

          // dgacitua: http://stackoverflow.com/a/171256
          for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
          for (var attrname in jsonObj) { docObj[attrname] = jsonObj[attrname]; } 

          docObj.id = incrementCounter('counters', 'documents');

          Documents.insert(docObj);
        });

        InvertedIndex.generate();
        InvertedIndex.save();

        return true;
      }
      else {
        console.error(err);
        return false;
      }
    }));
    */
  }

  static updateDocumentCollection(assetPath) {
    console.log('Updating Document Collection!');

    // TODO: Fix to use JSON documentList

    var syncedList = [];
    var documentList = JSON.parse(fs.readFileSync(path.join(assetPath, 'documents.json')));
    var total = documentList.length;

    /*
    var syncedList = [];
    var documentList = JSON.parse(fs.readFileSync(path.join(assetPath, 'documents.json')));
    
    glob(path.join(assetPath, '*.html'), Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Verifying existing documents...', (idx+1) + ' of ' + total);
          var docRoute = DocumentParser.getHtmlRoute(file),
               docData = Documents.findOne({ route: docRoute });

          if (!docData) {
            // dgacitua: Generate record for HTML files not in database
            DocumentParser.cleanDocument(file);

            var docObj = {};
            var parsedObj = DocumentParser.parseDocument(file);
            var jsonObj = documentList.find(o => o.url === path.basename(file));

            // dgacitua: http://stackoverflow.com/a/171256
            for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
            for (var attrname in jsonObj) { docObj[attrname] = jsonObj[attrname]; }
            
            docObj.id = incrementCounter('counters', 'documents');

            Documents.insert(docObj);
          }
          else {
            // dgacitua: Check if file has been modified (through MD5 Hash) and update if needed
            var currHash = DocumentParser.getMD5(file);

            if (docData.md5Hash !== currHash) {
              DocumentParser.cleanDocument(file);

              var docObj = {};
              var parsedObj = DocumentParser.parseDocument(file);
              var jsonObj = documentList.find(o => o.url === path.basename(file));

              // dgacitua: http://stackoverflow.com/a/171256
              for (var attrname in parsedObj) { docObj[attrname] = parsedObj[attrname]; }
              for (var attrname in jsonObj) { docObj[attrname] = jsonObj[attrname]; }

              docObj.id = docData.id

              Documents.update({ _id: docData._id}, docObj);
            }
          }

          syncedList.push(docData.route);
        });

        console.log('Removing documents without HTML file from database...');
        Documents.remove({ route: { $nin: syncedList }});

        InvertedIndex.generate();
        //InvertedIndex.save();

        return true;
      }
      else {
        console.error(err);
        return false;
      }
    }));
    */
  }

  static loadInvertedIndex() {
    if (process.env.NEURONE_SOLR_HOST) {
      SolrIndex.load();
      return true;  
    }
    else {
      LunrIndex.load();
      return true;
    }
  }

  static getDocumentCount() {
    return Documents.find().count();
  }
}