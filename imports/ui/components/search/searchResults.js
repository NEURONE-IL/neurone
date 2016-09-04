import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './searchResults.html';
import { Documents } from '../../../api/documents';

import SearchResultsService from './services/searchResultsService';

class SearchResults {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.results = SearchResultsService.get();
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
      url: '/searchResults',
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