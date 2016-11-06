import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';
import InvertedIndex from './invertedIndex';
import DocumentParser from './documentParser';

import { Documents } from '../../imports/api/documents/index';

export default class Indexer {
  static generateDocumentCollection(assetPath) {
    console.log('Generating Document Collection!');
    
    glob(path.join(assetPath, '*.html'), Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Indexing documents...', (idx+1) + ' of ' + total);

          DocumentParser.cleanDocument(file);

          var docObj = DocumentParser.parseDocument(file);
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
  }

  static updateDocumentCollection(assetPath) {
    console.log('Updating Document Collection!');

    var syncedList = [];
    
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

            var docObj = DocumentParser.parseDocument(file);
            docObj.id = incrementCounter('counters', 'documents');

            Documents.insert(docObj);
          }
          else {
            // dgacitua: Check if file has been modified (through MD5 Hash) and update if needed
            var currHash = DocumentParser.getMD5(file);

            if (docData.md5Hash !== currHash) {
              DocumentParser.cleanDocument(file);

              var docObj = DocumentParser.parseDocument(file);
              docObj.id = docData.id

              Documents.update({ _id: docData._id}, docObj);
            }
          }

          syncedList.push(docData.route);
        });

        console.log('Removing documents without HTML file from database...');
        Documents.remove({ route: { $nin: syncedList }});

        InvertedIndex.generate();
        InvertedIndex.save();

        return true;
      }
      else {
        console.error(err);
        return false;
      }
    }));
  }

  static loadInvertedIndex() {
    InvertedIndex.load();
  }

  static getDocumentCount() {
    return Documents.find().count();
  }

  static getAssetPath() {
    if (process.env.NEURONE_ASSET_PATH) {
      return process.env.NEURONE_ASSET_PATH;
    }
    else {
      if (Meteor.isDevelopment) {
        return path.join(Meteor.absolutePath, '/public/');
      }
      else {
        return path.join(Meteor.rootPath, '../web.browser/app/');
      }
    }
  }
}