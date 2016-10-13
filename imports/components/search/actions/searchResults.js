import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './searchResults.html';

import { name as Logger } from '../../logger/logger';

class SearchResults {
  constructor($scope, $reactive, $state, $stateParams, QueryTrackService) {
    'ngInject';

    this.$state = $state;
    this.qts = QueryTrackService;

    $reactive(this).attach($scope);

    this.documents = [];

    this.searchText = $stateParams.query;
    this.getResults($stateParams.query);
  }

  getResults(queryText) {
    var qt = queryText ? queryText : '';

    check(qt, String);

    this.call('searchDocuments', qt, function(error, result) {
      if (!error) {
        this.documents = result;
      }
      else {
        console.log(error);
      }
    });
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    this.qts.saveQuery(queryText);
    this.$state.go('searchResults', {query: queryText});
  }
};

const name = 'searchResults';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Logger
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
      url: '/searchResults?query',
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