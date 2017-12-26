import fs from 'fs-extra';
import path from 'path';
import scrape from 'website-scraper';

import DocumentParser from './documentParser';
import Indexer from './indexer';

import ServerConfigs from '../utils/serverConfigs';
import Utils from '../utils/serverUtils';

import { Documents } from '../../imports/database/documents/index';

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36';
const errorObj = { msg: 'ERROR!' };

// dgacitua: Paths for indexable documents
const dirName = path.join('assets', 'downloadedDocs');
const downloadDir = path.join(Utils.getAssetPath(), 'downloadedDocs');

// dgacitua: Paths for preview documents
const previewName = path.join('assets', 'previewDocs');
const previewDir = path.join(Utils.getAssetPath(), 'previewDocs');

export default class DocumentDownloader {
  // dgacitua: Create download directory (on Asset path) for automatic document downloading
  static createDownloadDirs() {
    try {
      fs.ensureDirSync(downloadDir);
      fs.ensureDirSync(previewDir);
    }
    catch (err) {
      console.log(err);
      throw new Meteor.Error(500, 'Cannot create download directories!', err);
    }
  }

  // dgacitua: Automatic document download from web
  static download(docName, documentUrl, isIndexable, callback) {
    let downloadPath, queryPath;

    if (isIndexable) {
      downloadPath = path.join(downloadDir, docName);
      queryPath = path.join(dirName, docName);
    }
    else {
      downloadPath = path.join(previewDir, 'currentDocument');
      queryPath = path.join(previewName, 'currentDocument');
    }
    
    let options = {
      urls: [ documentUrl ],
      directory: downloadPath,
      filenameGenerator: 'byType', //'bySiteStructure',
      request: { headers: { 'User-Agent': userAgent }}
    }

    fs.remove(downloadPath, (err, res) => {
      if (!err) {
        scrape(options, (err2, res2) => {
          if (!err2) {
            let response = {
              docName: docName,
              pageUrl: res2[0].url,
              route: path.join(queryPath, res2[0].filename),
              fullPath: path.join(downloadPath, res2[0].filename)
            };

            callback(null, response);
          }
          else {
            console.error('Error while downloading document', documentUrl, err2);
            callback(err2);
          }
        });  
      }
      else {
        console.error('Error while deleting old document files', documentUrl, err);
        callback(err);
      }
    });
  }

  // dgacitua: Download and index downloaded document
  static index(docObj, callback) {
    let indexedDocument = {
      docName: docObj.docName,
      title: docObj.title || 'New NEURONE Page',
      locale: docObj.locale || 'en',
      relevant: docObj.relevant || false,
      test: docObj.test || [ 'pilot' ],
      topic: docObj.topic || [ 'pilot' ],
      keywords: docObj.keywords || [],
      date: docObj.date || Utils.getDate(),
      url: docObj.url,
      searchSnippet: docObj.searchSnippet || '',
      indexedBody: ''
    };

    DocumentDownloader.download(docObj.docName, docObj.url, true, Meteor.bindEnvironment((err, res) => {
      if (!err) {
        indexedDocument.route = res.route;

        let check = DocumentParser.cleanDocument(res.fullPath);
        let docInfo = DocumentParser.getDocumentInfo(res.fullPath);

        for (var attrname in docInfo) { if(Utils.isEmpty(indexedDocument[attrname])) indexedDocument[attrname] = docInfo[attrname]; }

        let result = Documents.upsert({ route: indexedDocument.route }, indexedDocument);

        if (result.numberAffected > 0) {
          let doc = Documents.findOne({ route: indexedDocument.route });

          Indexer.indexDocumentAsync(doc, (err2, res2) => {
            if (!err2) {
              callback(null, doc);  
            }
            else {
              console.error('Error while indexing document', docObj.url, err2);
              callback(err2);
            }
          });
        }
        else {
          console.error('Error while saving document to Database', docObj.url, errorObj);
          callback(errorObj);
        }
      }
      else {
        callback(err);
      }
    }));
  }

  static fetch(docObj, callback) {
    console.log('Attempting to download document!');

    if (!Utils.isEmptyObject(docObj) && Utils.isString(docObj.docName) && Utils.isString(docObj.url)) {
      console.log('Document URL', docObj.url);

      DocumentDownloader.index(docObj, Meteor.bindEnvironment((err, res) => {
        if (!err) {
          console.log('Document downloaded and indexed successfully!', docObj.url);
          callback(null, res);
        }
        else {
          callback(errorObj);
        }
      }));
    }
    else {
      console.error('Document object is invalid!', docObj.url, errorObj);
      callback(errorObj);
    }
  }

  static preview(docObj, callback) {
    console.log('Attempting to preview document!');

    if (!Utils.isEmptyObject(docObj) && Utils.isString(docObj.docName) && Utils.isString(docObj.url)) {
      console.log('Document URL', docObj.url);

      let document = {
        _id: '<preview>',
        docName: docObj.docName,
        title: docObj.title || 'New NEURONE Page',
        locale: docObj.locale || 'en',
        relevant: docObj.relevant || false,
        test: docObj.test || [ 'preview' ],
        topic: docObj.topic || [ 'preview' ],
        keywords: docObj.keywords || [],
        date: docObj.date || Utils.getDate(),
        url: docObj.url,
        searchSnippet: docObj.searchSnippet || '',
        indexedBody: ''
      };

      DocumentDownloader.download(docObj.docName, docObj.url, false, Meteor.bindEnvironment((err, res) => {
        if (!err) {
          document.route = res.route;

          let check = DocumentParser.cleanDocument(res.fullPath);
          let docInfo = DocumentParser.getDocumentInfo(res.fullPath);
  
          for (var attrname in docInfo) { if(Utils.isEmpty(document[attrname])) document[attrname] = docInfo[attrname]; }

          console.log('Document downloaded for preview successfully!', docObj.url);

          callback(null, document);
        }
        else {
          callback(errorObj);
        }
      }));
    }
    else {
      console.error('Document object is invalid!', docObj.url, errorObj);
      callback(errorObj);
    }
  }
}

// dgacitua: Minimal example of use
/*
let obj1 = { docName: 'techcrunch', url: 'https://techcrunch.com/' };
let obj2 = { docName: 'wiki-en', url: 'https://en.wikipedia.org/'};

DocumentDownloader.fetch(obj1, (err, res) => { if(!err) console.log('ok1') });
DocumentDownloader.fetch(obj2, (err, res) => { if(!err) console.log('ok2') });
*/