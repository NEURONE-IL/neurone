/*
//function that returns a created index
var createIndex = function () {
  var index = lunr(function () {
    this.field('text');
    this.ref('_id');
  });
  return index;
};

Template.search.rendered = function () {
  //initiate the search session
  Session.setDefault('search', null);
};

Template.search.helpers({
  //create a helper to get what the current search value is
  search: function () {
    var search = Session.get('search');
    return search;
  },

  //create a helper that returns the search results
  searchResults: function () {
    var index, docs, searchResults;
    var search = Session.get('search');
    var results = [];
    if (search) {
      //create the index (see function above)
      index = createIndex();
      docs = Todos.find().fetch();
      //for each todo available to the client...
      _.each(docs, function (todo) {
        //add the todo to the index
        index.add(todo);
      });
      //process the search results
      //[{ref: 'mongoId', score: 0.923},...]
      searchResults = index.search(search);
      //for each of the search results score...
      _.each(searchResults, function (searchResult) {
        //only add if the results are above zero, zero means no result
        if (searchResult.score > 0) {
          //add doc to the list of valid results
          results.push(_.findWhere(docs, {_id: searchResult.ref}));
        }
      });
    }
    return results;
  }
  });

  Template.search.events({
    //update the search session when the search input changes
    'keyup #search, change #search' : function (event) {
      var search;
      search = event.target.value;
      Session.set('search', search);
    },
  });
*/