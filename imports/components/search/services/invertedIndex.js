import { lunr } from 'meteor/lbee:lunr';

export default class InvertedIndexService {
  constructor() {}

  static createIndex() {
    var idx = lunr(function() {
      this.field('title', { boost: 2 })
      this.field('body')
    });

    return idx;
  }

  static searchDocument(idx, query) {
    return idx.search(query);
  }

  static addDocument(idx, doc) {
    idx.add(doc);
  }

  static removeDocument(idx, doc) {
    idx.remove(doc);
  }
}