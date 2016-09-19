import { FilesCollection } from 'meteor/ostrio:files';
import { himalaya } from 'himalaya';

export default class DocumentParserService {
  constructor() {}

  static html2json(html) {
    var json = himalaya.parse(html);
    return json;
  }

  // dgacitua: http://docs.meteor.com/api/assets.html
  static getTextAsset(filepath) {
    return Assets.getText(filepath);
  }

  static getBinaryAsset(filepath) {
    return Assets.getBinary(filepath);
  }
}