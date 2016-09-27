import FilesCollection from 'meteor/ostrio:files';
import fs from 'fs';
import himalaya from 'himalaya';
import sanitizeHtml from 'sanitize-html';

export default class DocumentParserService {
  constructor() {}

  static html2json(html) {
    var json = himalaya.parse(html);
    return json;
  }

  static removeLinks(htmlString) {
    var cleanText = sanitizeHtml(htmlString, {
      exclusiveFilter: function(frame) {
        return frame.tag === 'a';
      }
    });
    return cleanText;
  }

  static readTextFile(path, callback) {
    fs.readFile(path, function(err, data) {
      if (!err) {
        return callback(null, data.toString());
      }
      else {
        return callback(err);        
      }
    });
  }

  static writeTextFile(path, text) {
    fs.writeFile(path, text, function(err) {
      if (!err) {
        console.log('File written!', path);
      }
      else {
        return console.log(err);
      }
    });
  }
}