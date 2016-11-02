import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';
import InvertedIndex from './invertedIndex';
import DocumentParser from './documentParser';

import { Documents } from '../../imports/api/documents/index';

export default class Indexer {
  static generateDocumentCollection() {
    console.log('Generating Document Collection...');
    const publicFolder = Meteor.absolutePath + '/public/';
    
    glob(publicFolder + '*.html', Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Indexing documents...', (idx+1) + ' of ' + total);

          DocumentParser.removeLinks(file);

          var docObj = DocumentParser.parseDocument(file);
          docObj.id = incrementCounter('counters', 'documents');

          Documents.insert(docObj);
        });

        InvertedIndex.generate();
        InvertedIndex.save();
      }
      else {
        console.error(err);
      }
    }));
  }

  static updateDocumentCollection() {
    console.log('Updating Document Collection...');

    var publicFolder = Meteor.absolutePath + '/public/',
          syncedList = [];
    
    glob(publicFolder + '*.html', Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Verifying existing documents...', (idx+1) + ' of ' + total);
          var docRoute = DocumentParser.getHtmlRoute(file),
               docData = Documents.findOne({ route: docRoute });

          if (docData==={} || !docData) {
            DocumentParser.removeLinks(file);

            var docObj = DocumentParser.parseDocument(file);
            docObj.id = incrementCounter('counters', 'documents');

            Documents.insert(docObj);  
          }

          syncedList.push(docData.route);
        });

        console.log('Removing documents without HTML file from database...');
        Documents.remove({ route: { $nin: syncedList }});

        InvertedIndex.generate();
        InvertedIndex.save();
      }
      else {
        console.error(err);
      }
    }));
  }

  static loadInvertedIndex() {
    InvertedIndex.load();
  }

  static getDocumentCount() {
    return Documents.find().count();
  }
}