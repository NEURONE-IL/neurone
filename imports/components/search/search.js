import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './search.html';

import { name as Logger } from '../logger/logger';

import { name as SearchResults } from './actions/searchResults';
import { name as DisplayPage } from './actions/displayPage';
import { name as DisplayIframe } from './iframe/displayIframe';

class Search {
  constructor($scope, $rootScope, $reactive, $state, QueryTrackService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.qts = QueryTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      this.$rootScope.$broadcast('updateBookmarkList', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.$broadcast('updateBookmarkList', true);
    });

    $reactive(this).attach($scope);

    this.searchText = '';
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    this.qts.saveQuery(queryText);
    this.$state.go('searchResults', {query: queryText});
  }
}

const name = 'search';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Logger,
  SearchResults,
  DisplayPage,
  DisplayIframe
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