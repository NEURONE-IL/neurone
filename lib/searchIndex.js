// dgacitua: Search index
// Powered by search-index https://github.com/fergiemcdowall/search-index

import { Meteor } from 'meteor/meteor';

import searchIndex from 'search-index';

module.exports = function (options, callback) {
  const defaultOption = {indexPath: 'myIndex'};
  const searchIndex = require('search-index')
  var searchModule = {}
  var options = options || defaultOption;

  searchIndex(options, function (err, si) {
    if (err) {
      console.log(err, null)
    } else {
      searchModule.si = si
      searchModule.add = si.add
      searchModule.search = si.search
      searchModule.tellMeAboutMySearchIndex = si.tellMeAboutMySearchIndex
      return callback(null, searchModule)
    }
  })
}

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