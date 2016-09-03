import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './search.html';
import { Documents } from '../../../api/documents';

class Search {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.searchRes = [];
    this.searchSession = null;

    //Session.setDefault('searchSession', null);

    this.helpers({
      //create a helper to get what the current search value is
      search() {
        var search = this.searchSession; //Session.get('searchSession');
        return search;
      },
      //create a helper that returns the search results
      searchResults() {
        var index, docs, searchResults;
        var search = this.searchSession; //Session.get('searchSession');
        var results = [];
        if (search) {
          //create the index (see function above)
          index = createIndex();
          docs = Documents.find().fetch();
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
        this.searchRes = results;
        console.log(this.searchRes);
        return results;    
      },
    });
  }

  doSearch() {
    var search;
    search = this.searchText;//event.target.value;
    this.searchSession = search; //Session.set('searchSession', search);
    //this.helpers.searchResults();
  }

  createIndex() {
    var index = lunr(function () {
      this.field('text');
      this.ref('_id');
    });
    return index;    
  }
};

const name = 'search';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: Search
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('search', {
      url: '/search',
      template: '<search></search>',
      resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};

