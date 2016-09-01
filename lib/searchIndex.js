// dgacitua: Search index
// Powered by search-index https://github.com/fergiemcdowall/search-index


const si = require('search-index')

//
module.exports = function (callback) {
  searchIndex(options, function(err, si) {
    si.add(data, opt, function (err) {
      //add stuff to index 
      if (!err) console.log('success!');
    });
   
    si.search(q, function (err, searchResults) {
      //search in index 
    });
  });
};

/*
exports.getOffset = function(page, pageSize) {
  return ((page - 1) * pageSize);
};

exports.addToIndex = function(documentArray) {
  var si = require('search-index')({indexPath: 'docindex', logLevel: 'info'});

  si.add(documentArray, options, function(err) {
    if (!err) console.log('Add Documents Success!')
  });
};

exports.clearIndex = function(callback) {
  var si = require('search-index')({indexPath: 'docindex', logLevel: 'info'});

  si.flush(function(err) {
    if (!err) console.log('Clear Index Success!')
    else return callback(err, {})
  });
};

exports.aboutIndex = function() {
  var si = require('search-index')({indexPath: 'docindex', logLevel: 'info'});

  si.tellMeAboutMySearchIndex(function (err, info) {
      console.log(info);
  });
};
*/

/*
exports.Search = function(callback) {

si = require('search-index');

getOffset = function(page, pageSize) {
  return ((page - 1) * pageSize);
};

addToIndex = function(documentArray) {
  //SearchIndex(options, function(err, si) {
    si.add(documentArray, options, function(err) {
      if (!err) console.log('Add Documents Success!')
    });
  //});
};

clearIndex = function() {
  //SearchIndex(options, function(err, si) {
    si.flush(function(err) {
      if (!err) console.log('Clear Index Success!')
    });
  //});
};

queryIndex = function(queryText, page, pageSize) {
  var results = [];

  //SearchIndex(options, function(err, si) {
    q.query = {
      AND: [{'*': [queryText]}] //search for string 'usa' in all ('*') fields
    };

    q.offset = getOffset(page, pageSize);
    q.pageSize = pageSize;

    si.search(q, function (err, searchResults) {
      results = searchResults;
    });
  //});

  return results;
};

aboutIndex = function() {
  si.tellMeAboutMySearchIndex(function (err, info) {
      console.log(info);
  });
  
  SearchIndex(options, function(err, si) {
    si.tellMeAboutMySearchIndex(function (err, info) {
      console.log(info)
    });
  });
  
};
*/