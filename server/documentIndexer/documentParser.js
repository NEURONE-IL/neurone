import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import htmlToText from 'html-to-text';
import uppercamelcase from 'uppercamelcase';

import Utils from '../lib/utils';

export default class DocumentParser {
  constructor() {}

  static getHtmlAsText(documentPath, callback) {
    var relPath = documentPath;   //Meteor.absolutePath + documentPath;

    var options = {
      wordwrap: false,
      ignoreHref: true,
      ignoreImage: true
    };

    htmlToText.fromFile(relPath, options, Meteor.bindEnvironment((err, text) => {
      if (!err) {
        //console.log(relPath, text);
        callback(null, text);
      }
      else {
        console.error(err);
        callback(err);
      }      
    }));
  }

  static getHtmlTitle(documentPath, callback) {
    var relPath = documentPath;   //Meteor.absolutePath + documentPath;

    fs.readFile(relPath, Meteor.bindEnvironment((err, data) => {
      if (!err) {
        var htmlString = data.toString(),
                 cheer = cheerio.load(htmlString),
                 title = cheer('head > title').text() || cheer('title').text() || cheer('h1').first().text() || 'Untitled Document';

        //console.log(relPath, title);
        callback(null, title);
      }
      else {
        console.error(err);
        callback(err);
      }
    }));
  }

  static getHtmlDocname(documentPath) {
    var relPath = documentPath,   //Meteor.absolutePath + documentPath,
        fileExt = path.extname(relPath),
       fileName = path.basename(relPath, fileExt),
          route = uppercamelcase(fileName);

    //console.log(relPath, route);
    return route;
  }

  static getHtmlRoute(documentPath) {
    var relPath = documentPath,   //Meteor.absolutePath + documentPath,
       fileName = path.basename(relPath);

    //console.log(relPath, fileName);
    return fileName;
  }

  static removeLinks(documentPath) {
    var relPath = documentPath,   //Meteor.absolutePath + documentPath;
        fileDir = path.dirname(relPath),
        fileExt = path.extname(relPath),
       fileName = path.basename(relPath, fileExt),
    newFilename = fileName + fileExt;

    var htmlFile = fs.readFileSync(relPath),
      htmlString = htmlFile.toString(),
               $ = cheerio.load(htmlString);

    // dgacitua: Remove all anchor tags with links
    $('a[href]').each((i, elem) => {
      var content = $(elem.childNodes);
      $(elem).replaceWith(content);
    });

    // dgacitua: Remove input forms
    $('input').each((i, elem) => {
      $(elem).remove();
    });    

    htmlString = $.html();

    fs.writeFileSync(path.join(fileDir, newFilename), htmlString);
    //console.log('Document Cleaned!', newFilename);
  }

  static parseDocument(documentPath) {
    var getTitle = Meteor.wrapAsync(this.getHtmlTitle),
         getBody = Meteor.wrapAsync(this.getHtmlAsText);

    var obj = {
      title: '',
      body: '',
      indexedBody: '',
      date: Utils.getDate(),
      topics: [],
      docName: this.getHtmlDocname(documentPath),
      route: this.getHtmlRoute(documentPath),
      url: '',
      id: 0
    }

    obj.title = getTitle(documentPath);
    obj.indexedBody = getBody(documentPath);

    //console.log('Document Parsed!', obj.route);
    return obj;
  }
}

Meteor.methods({
  parseDocument: (doc) => {
    DocumentParser.removeLinks(Meteor.absolutePath + '/public/sawao_kato.html');
    //return DocumentParser.parseDocument(doc);
  }, 
})