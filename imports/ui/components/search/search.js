import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './search.html';
import { Documents } from '../../../api/documents';

import { name as SearchResults } from './searchResults';

class Search {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.searchText = '';
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    this.$state.go('searchResults', {query: queryText});
  }
}

const name = 'search';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  SearchResults
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