import { FilesCollection } from 'meteor/ostrio:files';
import { himalaya } from 'himalaya';
import { sanitizeHtml } from 'sanitize-html';

export default class DocumentParserService {
  constructor() {}

  static html2json(html) {
    var json = himalaya.parse(html);
    return json;
  }

  // dgacitua: http://docs.meteor.com/api/assets.html
  static getTextAsset(assetPath) {
    return Assets.getText(assetPath);
  }

  static getBinaryAsset(assetPath) {
    return Assets.getBinary(assetPath);
  }

  static getAbsolutePath(assetPath) {
    return Assets.absoluteFilePath(assetPath);
  }

  static removeLinks(htmlString) {
    var cleanText = sanitizeHtml(htmlString, {
      exclusiveFilter: function(frame) {
        return frame.tag === 'a' && !frame.text.trim();
      }
    });
    return cleanText;
  }
}