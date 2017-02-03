import fs from 'fs';
import path from 'path';
import iconv from 'iconv';
import charset from 'charset';
import jschardet from 'jschardet';
import md5File from 'md5-file';
import cheerio from 'cheerio';
import htmlToText from 'html-to-text';
import unfluff from 'unfluff';
import uppercamelcase from 'uppercamelcase';

import Utils from '../lib/utils';

export default class DocumentParser {
  static getHtmlAsText(documentPath) {
    try {
      var relPath = documentPath,
         htmlFile = this.readFile(relPath),
       htmlString = htmlFile.toString();

      /*
      var site = unfluff.lazy(htmlFile),
          lang = site.lang(),
         title = site.title(),
           url = site.canonicalLink(),
          text = site.text();

      return text || '';
      */
      
      /*
      var options = {
        wordwrap: false,
        uppercaseHeadings: false,
        ignoreHref: true,
        ignoreImage: true
      };

      return htmlToText.fromString(htmlFile, options) || '';
      */

      var $ = cheerio.load(htmlString);
      
      $('script').remove();
      $('noscript').remove();
      
      return $('body').text().toString().replace(/\s{2,9999}/g, ' ');
    }
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static getHtmlTitle(documentPath, callback) {
    try {
      var relPath = documentPath,
         htmlFile = this.readFile(relPath),
       htmlString = htmlFile.toString(),
                $ = cheerio.load(htmlString),
            title = $('head > title').text() || $('title').text() || $('h1').first().text() || 'Untitled Document';

      //console.log(relPath, title);
      return title;
    }
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static getHtmlDocname(documentPath) {
    try {
      var relPath = documentPath,
          fileExt = path.extname(relPath),
         fileName = path.basename(relPath, fileExt),
            route = uppercamelcase(fileName);

      //console.log(relPath, route);
      return route;
    }
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static getHtmlRoute(documentPath) {
    try {
      var relPath = documentPath,
         fileName = path.basename(relPath);

      //console.log(relPath, fileName);
      return fileName;
    }
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static getMD5(documentPath) {
    try {
      return md5File.sync(documentPath);
    }
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static cleanDocument(documentPath) {
    try {
      var relPath = documentPath,
          fileDir = path.dirname(relPath),
          fileExt = path.extname(relPath),
         fileName = path.basename(relPath, fileExt),
      newFilename = fileName + fileExt;

      var htmlFile = this.readFile(relPath),
        htmlString = htmlFile.toString(),
                 $ = cheerio.load(htmlFile);

      // dgacitua: Remove all anchor tags with links
      /*
      $('a[href]').each((i, elem) => {
        var content = $(elem.childNodes);
        $(elem).replaceWith(content);
      });
      */

      // dgacitua: Remove href attribute from all tags
      $('a').each((i, elem) => {
        $(elem).removeAttr('href');
        $(elem).removeAttr('onclick');
      });

      // dgacitua: Remove javascript
      $('script').each((i, elem) => {
        $(elem).removeAttr('src');

        /*
        if ($(elem).attr('type') === 'text/javascript' || $(elem).attr('type') === 'application/javascript') {
          $(elem).remove();
        }
        */
      });

      // dgacitua: Disable input elements
      $('input').each((i, elem) => {
        $(elem).attr('disabled', 'true');
      });

      // dgacitua: Disable submit
      $('input[type="submit"]').each((i, elem) => {
        $(elem).removeAttr('type');
      });

      $('button[type="submit"]').each((i, elem) => {
        $(elem).removeAttr('type');
      });

      // dgacitua: Disable form action
      $('form').each((i, elem) => {
        $(elem).removeAttr('action');
      });

      // dgacitua: Remove iframe elements
      $('iframe').each((i, elem) => {
        $(elem).remove();
      });

      var cleanedHtml = $.html();

      fs.writeFileSync(path.join(fileDir, newFilename), cleanedHtml);
      //console.log('Document Cleaned!', newFilename);

      return true;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  static readFile(path) {
    // dgacitua: http://stackoverflow.com/a/18711982
    var htmlBuffer = fs.readFileSync(path),
        htmlString = htmlBuffer.toString(),
          encoding = charset([], htmlString);   // || jschardet.detect(htmlString).encoding.toLowerCase();

    if (encoding === 'utf-8' || encoding === 'utf8' || !encoding) {
      return htmlString;
    }
    else {
      var ic = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE'),
         buf = ic.convert(htmlBuffer),
         str = buf.toString('utf-8');

      return str;
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
    };

    //console.log('Document Parsed!', obj.route);
    return obj;
  }
}