import { FilesCollection } from 'meteor/ostrio:files';
import { himalaya } from 'himalaya';

export default class DocumentParserService {
  constructor() {}

  static parseHTML(html) {
    var json = himalaya.parse(html);
    return json;
  }
}