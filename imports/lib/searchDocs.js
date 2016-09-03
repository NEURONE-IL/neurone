// Actual text search function
// http://meteorpedia.com/read/Fulltext_search
_searchDinosaurs = function (searchText) {
  var Future = Npm.require('fibers/future');
  var future = new Future();
  Meteor._RemoteCollectionDriver.mongo.db.executeDbCommand({
    text: 'documents',
    search: searchText,
    project: {
      id: 1 // Only take the ids
    }
   }
   , function(error, results) {
    if (results && results.documents[0].ok === 1) {
      future.ret(results.documents[0].results);
    }
    else {
      future.ret('');
    }
  });
  return future.wait();
};
 
// Helper that extracts the ids from the search results
searchDinosaurs = function (searchText) {
  if (searchText && searchText !== '') {
  var searchResults = _searchDinosaurs(searchText);
  var ids = [];
    for (var i = 0; i < searchResults.length; i++) {
      ids.push(searchResults[i].obj._id);
    }
  return ids;
  }
};