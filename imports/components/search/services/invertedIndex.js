import { lunr } from 'meteor/lbee:lunr';

export default class InvertedIndex {
  constructor() {}

  static createIndex() {
    var idx = lunr(function() {
      this.field('title', { boost: 3 })
      this.field('body')
      this.field('topics', { boost: 2 })
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