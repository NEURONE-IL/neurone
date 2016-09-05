import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './searchResults.html';
import { Documents } from '../../../api/documents';

class SearchResults {
  constructor($scope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.results = [{
      title: "Title test",
      body: "Body test"
    }];

    this.populateResults($stateParams.query);
  }

  populateResults(queryText) {
    var qt = queryText ? queryText : '';

    check(qt, String);
    
    Meteor.call('searchIndex', qt, function(error, result) {
      if (!error) {
        var searchResult = result.response.docs;
        //this.results = searchResult.results.docs;
        console.log(searchResult);
        this.results = searchResult;
      }
      else {
        console.log(error);
      }
    });
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    //this.populateResults(queryText);
    this.$state.go('searchResults', {query: queryText});
  }
};

const name = 'searchResults';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: SearchResults
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('searchResults', {
      url: '/searchResults/:query',
      template: '<search-results></search-results>',
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