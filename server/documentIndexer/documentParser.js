import fs from 'fs';
import path from 'path';
import md5File from 'md5-file';
import cheerio from 'cheerio';
import htmlToText from 'html-to-text';
import uppercamelcase from 'uppercamelcase';

import Utils from '../lib/utils';

export default class DocumentParser {
  static getHtmlAsText(documentPath) {
    try {
      var relPath = documentPath,   //Meteor.absolutePath + documentPath;
         htmlFile = fs.readFileSync(relPath);

      var options = {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true
      };

      return htmlToText.fromString(htmlFile, options);
    }
    catch (e) {
      console.error(e);
    }
  }

  static getHtmlTitle(documentPath, callback) {
    try {
      var relPath = documentPath,   //Meteor.absolutePath + documentPath;
         htmlFile = fs.readFileSync(relPath),
       htmlString = htmlFile.toString(),
                $ = cheerio.load(htmlString),
            title = $('head > title').text() || $('title').text() || $('h1').first().text() || 'Untitled Document';

      //console.log(relPath, title);
      return title;
    }
    catch (e) {
      console.error(e);
    }
  }

  static getHtmlDocname(documentPath) {
    try {
      var relPath = documentPath,   //Meteor.absolutePath + documentPath,
          fileExt = path.extname(relPath),
         fileName = path.basename(relPath, fileExt),
            route = uppercamelcase(fileName);

      //console.log(relPath, route);
      return route;
    }
    catch (e) {
      console.error(e);
    }
  }

  static getHtmlRoute(documentPath) {
    try {
      var relPath = documentPath,   //Meteor.absolutePath + documentPath,
         fileName = path.basename(relPath);

      //console.log(relPath, fileName);
      return fileName;
    }
    catch (e) {
      console.error(e);
    }
  }

  static cleanDocument(documentPath) {
    try {
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

      // dgacitua: Remove javascript
      $('script').each((i, elem) => {
        $(elem).remove();
      });

      // dgacitua: Remove input elements
      $('input').each((i, elem) => {
        $(elem).remove();
      });

      htmlString = $.html();

      fs.writeFileSync(path.join(fileDir, newFilename), htmlString);
      //console.log('Document Cleaned!', newFilename);
    }
    catch (e) {
      console.error(e);
    }
  }

  static getMD5(documentPath) {
    try {
      return md5File.sync(documentPath);
    }
    catch (e) {
      console.error(e);
    }
  }

  static parseDocument(documentPath) {
    var obj = {
      title: this.getHtmlTitle(documentPath),
      indexedBody: this.getHtmlAsText(documentPath),
      date: Utils.getDate(),
      topics: [],
      docName: this.getHtmlDocname(documentPath),
      route: this.getHtmlRoute(documentPath),
      id: 0,
      md5Hash: this.getMD5(documentPath)
    }

    //console.log('Document Parsed!', obj.route);
    return obj;
  }
}