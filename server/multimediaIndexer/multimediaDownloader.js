import fs from 'fs-extra';
import path from 'path';

import Indexer from '../documentIndexer/indexer';

import Utils from '../utils/serverUtils';

import { Video, ImageSearch, Book, Documents} from '../database/definitions';

const errorObj = { msg: 'ERROR!' };

const downloadDir = path.join(Utils.getAssetPath(), 'multimedia');


export default class MultimediaDownloader {

  static createDownloadDirs() {
    try {
      fs.ensureDirSync(downloadDir);
      fs.ensureDirSync(path.join(downloadDir, "books"));
      fs.ensureDirSync(path.join(downloadDir, "videos"));
    }
    catch (err) {
      console.log(err);
      throw new Meteor.Error(500, 'Cannot create download directories!', err);
    }
  }

  static deleteFile(obj) {
    fs.remove(path.join(Utils.getAssetPath(), "../")+obj.route, err => {
      if (err) {
        console.log("Failed to delete "+ err)
      } else {
        console.log("File deleted succesfully!")
      }
    })
  }


  static downloadBook(obj,callback) {
    const crawler = require('crawler-request')
    const download = require('file-download');

    let downloadPath, options, fileName;

    this.createDownloadDirs();

    downloadPath = path.join(downloadDir, "books");
    fileName = obj.docName + "." + obj.url.substr((obj.url.lastIndexOf('.') + 1))
    options = {
        directory: downloadPath,
        filename: fileName
    }
 
    crawler(obj.url).then(function(response){

      download(obj.url, options, function (err){
        if (err) throw err;
    })
      let res = {
        docName: fileName,
        route: 'assets/multimedia/books/'+fileName,
        text: response.text,
        url: obj.url
      }
      
      callback(null,res)

    })
  }

  /*Get a youtube video with thumbnail
   *
   */
  static downloadVideo(obj, callback){

    let response,
      downloader = require('youtube-dl'),
      downloadPath = path.join(downloadDir, "videos"),
      video = downloader(obj.url);

    this.createDownloadDirs()
    
    options = {
      all: false,
      cwd: downloadPath,
    }

    video.pipe(fs.createWriteStream(downloadPath+"/"+obj.docName+".mp4"));

    downloader.getThumbs(obj.url, options, function(err, file) {
      if (!err) {
        console.log('Video download started!');
        video.on('info', function(info){
          info.route = downloadPath+"/"+obj.docName+".mp4";
          response = {
            categories : info.categories,
            description : info.description || info.title ,
            title : info.title,
            tags : info.tags,
            route: 'assets/multimedia/videos/'+obj.docName+".mp4",
            thumbnail: 'assets/multimedia/videos/'+file[0],
            docName: obj.docName,
            domain: obj.domain,
            task: obj.task,
            locale: obj.locale
          };
          callback(null, response)
          });
        }
        else {
          throw err;
        }
    })
    
  }

  

  static indexMultimedia(obj, callback) {

    let doc;
    let indexedDocument = {
      title: obj.docName,
      docName: obj.docName,
      locale:  obj.locale || 'en' ,
      relevant: obj.relevant || false,
      keywords: obj.keywords || [],
      type: obj.type,
      task: obj.task || 'test' ,
      domain: obj.domain || 'test', 
      date: Utils.getDate(),
      url: obj.url || '',
      indexedBody: '',
      thumbnail: '' //for videos
    };

    
    if(obj.type == 'video'){
      MultimediaDownloader.downloadVideo(obj, Meteor.bindEnvironment((err, res) => {
        if (!err) {

          indexedDocument.title = res.title;
          indexedDocument.route = res.route;
          indexedDocument.keywords = indexedDocument.keywords.concat(res.tags).join(' ');
          indexedDocument.thumbnail = res.thumbnail;
          indexedDocument.indexedBody = res.description;
          console.log("saving video")
          let result = Video.upsert({ route: indexedDocument.route }, indexedDocument);

          if (result.numberAffected > 0) {
            let doc = Video.findOne({ route: indexedDocument.route });

            Indexer.indexDocumentAsync(doc, (err, res) => {
              console.log(err)
              if(!err){
                callback(null,doc)
              }
              else{
                console.error('ERROR INDEXANDE',doc)
                callback(err)
              }
            })
          }
          else {
            console.error('Error while saving video to Database', obj.url, errorObj);
            callback(errorObj);
          }
          console.log(Video.find());
        }
        else {
          callback(err);
        }
    }));

    }

    else if(obj.type == 'book'){
      MultimediaDownloader.downloadBook(obj, Meteor.bindEnvironment((err, res) => {
        if (!err) {

          indexedDocument.route = res.route;
          indexedDocument.indexedBody = res.text;
          let result = Book.upsert({ route: indexedDocument.route }, indexedDocument);

          if (result.numberAffected > 0) {
            let doc = Book.findOne({ route: indexedDocument.route });

            Indexer.indexDocumentAsync(doc, (err, res) => {
              console.log(err)
              if(!err){
                callback(null,doc)
              }
              else{
                console.error('ERROR ',doc)
                callback(err)
              }
            })
          }
          else {
            console.error('Error while saving document to Database', obj.url, errorObj);
            callback(errorObj);
          }
        }
        else {
          callback(err);
        }
    }));

    }

  }

  static fetch(docObj, callback) {
    console.log('Attempting to download file!');

    if (!Utils.isEmptyObject(docObj) && Utils.isString(docObj.docName) && Utils.isString(docObj.url)) {
      console.log(' URL', docObj.url);

      multimediaDownloader.indexMultimedia(docObj, Meteor.bindEnvironment((err, res) => {
        if (!err) {
          console.log('Multimedia file downloaded and indexed successfully!', docObj.url);
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

    const http = require('http');
    const fileType = require('file-type');
    if (docObj.type == 'book'){

      console.log(docObj)
     http.get(docObj.url, response => {
       response.on('readable',() => {
         const chunk = response.read(fileType.minimumBytes);
         response.destroy();
         console.log(fileType(chunk))
         if (fileType(chunk).ext == 'pdf' ){
            callback(null, docObj);
         }
         else{
           callback("BAD TYPE",null)
         }
       })
     })

    }

    else if((docObj.url.indexOf('youtube.com')) && docObj.type == 'video' ){

      console.log("VALID");
      callback(null, docObj);
    }
    else{
      console.log('invalid')
      callback(null)
    }

  }
}
