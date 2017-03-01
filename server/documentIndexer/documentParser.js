import fs from 'fs';
import path from 'path';
import iconv from 'iconv';
import charset from 'charset';
import jschardet from 'jschardet';
import sha from 'sha';
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
      // dgacitua: http://stackoverflow.com/a/31543727
      var $ = cheerio.load(htmlFile);
      
      var text = $('body *').contents().map(() => {
                  return (this.type === 'text') ? $(this).text()+' ' : '';
                }).get().join('');
      
      return text;
      */
      
      var options = {
        wordwrap: false,
        uppercaseHeadings: false,
        ignoreHref: true,
        ignoreImage: true
      };

      return htmlToText.fromString(htmlFile, options) || '';
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

  static getHash(documentPath) {
    try {
      return sha.getSync(documentPath, { algorithm: 'sha256' });
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

      $('div').each((i, elem) => {
        $(elem).removeAttr('onclick');

        // dgacitua: Highly specific filter for ads
        if ($(elem).hasClass('widget_ad') || $(elem).hasClass('fb-social-plugin') || $(elem).hasClass('leikiwidget')) {
          $(elem).remove();
        }
      });

      $('p script').each((i, elem) => {
        if ($(elem).attr('type') === 'text/javascript') {
          $(elem).remove();
        }
      });

      $('select').each((i, elem) => {
        $(elem).removeAttr('id');
        $(elem).removeAttr('onchange');
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
        $(elem).removeAttr('id');
        $(elem).attr('disabled', 'true');
      });

      // dgacitua: Disable button elements
      $('button').each((i, elem) => {
        $(elem).removeAttr('id');
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
        $(elem).removeAttr('method');
      });

      // dgacitua: Remove iframe elements
      $('iframe').each((i, elem) => {
        $(elem).remove();
      });

      // dgacitua: Remove object elements
      $('object').each((i, elem) => {
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
    try {
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
    catch (e) {
      console.error(e);
      return '';
    }
  }

  static parseDocument(documentPath) {
    var obj = {
      title: this.getHtmlTitle(documentPath),
      indexedBody: this.getHtmlAsText(documentPath),
      date: Utils.getDate(),
      docName: this.getHtmlDocname(documentPath),
      route: this.getHtmlRoute(documentPath),
      hash: this.getHash(documentPath)
    };

    //console.log('Document Parsed!', obj.route);
    return obj;
  }
}