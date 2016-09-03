import 'meteor/lbee:lunr';

exports.createIndex = function () {
  var index = lunr(function () {
    // TODO Change for definitive fields
    this.field('title', { boost: 10 });
    this.field('body');
    this.field('topics', { boost: 5 });
    this.field('places');
    this.ref('id');
  });

  return index;
};

exports.searchIndex = function(idx, query) {
  var ret = idx.search(query);
  //console.log('Search Results: ' + ret);
  return ret;
};

exports.addToIndex = function(idx, doc) {
  idx.add(doc);
  //console.log('Document added to Index!');
};

exports.removeFromIndex = function(idx, doc) {
  idx.remove(doc);
  //console.log('Document removed from Index!');
};