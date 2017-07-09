import fs from 'fs-extra';
import path from 'path';
import scrape from 'website-scraper';

import DocumentParser from './documentParser';
import Indexer from './indexer';

import ServerConfigs from '../serverConfigs';
import Utils from '../utils/serverUtils';

import { Documents } from '../../imports/database/documents/index';

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36';

const dirName = 'downloadedDocs';
const downloadDir = path.join(Utils.getAssetPath(), dirName);

const errorObj = { msg: 'ERROR!' };

export default class DocumentDownloader {
  // dgacitua: Create download directory (on Asset path) for automatic document downloading
  static createDownloadDir() {
    fs.ensureDirSync(downloadDir);
  }

  // dgacitua: Automatic document download from web
  //           This method requires a GNU/Linux server with wget package installed
  static download(docName, documentUrl, callback) {
    let pageDir = path.join(downloadDir, docName);

    let options = {
      urls: [ documentUrl ],
      directory: pageDir,
      filenameGenerator: 'bySiteStructure',
      request: { headers: { 'User-Agent': userAgent }}
    }

    fs.remove(pageDir, (err, res) => {
      if (!err) {
        scrape(options, (err2, res2) => {
          if (!err2) {
            let response = {
              docName: docName,
              pageUrl: res2[0].url,
              route: path.join(dirName, docName, res2[0].filename),
              fullPath: path.join(pageDir, res2[0].filename)
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
      searchSnippet: docObj.searchSnippet || 'This is the first paragraph of the new NEURONE Document',
      indexedBody: ''
    };

    DocumentDownloader.download(docObj.docName, docObj.url, Meteor.bindEnvironment((err, res) => {
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
}

// dgacitua: Minimal example of use
/*
let obj1 = { docName: 'techcrunch', url: 'https://techcrunch.com/' };
let obj2 = { docName: 'wiki-en', url: 'https://en.wikipedia.org/'};

DocumentDownloader.fetch(obj1, (err, res) => { if(!err) console.log('ok1') });
DocumentDownloader.fetch(obj2, (err, res) => { if(!err) console.log('ok2') });
*/