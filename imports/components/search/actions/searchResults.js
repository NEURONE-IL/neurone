import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import template from './searchResults.html';

import { name as Logger } from '../../logger/logger';

/*
    dgacitua

    Module Dependencies:
        mark.js
        angular-truncate-2
        Logger
*/

class SearchResults {
  constructor($scope, $rootScope, $reactive, $state, $document, $stateParams, UserDataService, QueryTrackService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$document = $document;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.qts = QueryTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      //this.$rootScope.$broadcast('updateBookmarkList', false);
      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: false });
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ stageHome: '/home' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      //this.$rootScope.$broadcast('updateBookmarkList', true);
      var limit = this.uds.getConfigs().maxBookmarks;
      var setReady = (this.uds.getSession().bookmarkCount >= limit) ? true : false;

      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: true });
      this.uds.setSession({ stageNumber: 1 });
      this.uds.setSession({ readyButton: setReady });
      this.uds.setSession({ stageHome: '/search' });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    this.documents = [];

    this.resultsReady = false;
    this.searchText = $stateParams.query;
    this.getResults($stateParams.query);
  }

  getResults(queryText) {
    var qt = queryText ? queryText : '';

    check(qt, String);

    this.call('searchDocuments', qt, function(error, result) {
      if (!error) {
        this.documents = result;

        // dgacitua: Pagination
        this.totalResults = this.documents.length;
        this.currentPage = 1;
        this.resultsPerPage = 10;
        this.paginationMaxSize = 5;

        // dgacitua: Apply changes
        this.resultsReady = true;
        //console.log('Search Results', this.documents);
        this.$scope.$apply();

        this.highlightSearch(qt);
        this.$scope.$apply();
      }
      else {
        this.resultsReady = true;
        //console.error('Error while getting documents', error);
        this.$scope.$apply();
      }
    });
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    this.qts.saveQuery(queryText);
    this.$state.go('searchResults', {query: queryText});
  }

  highlightSearch(queryText) {
    var qt = queryText ? queryText : '';
    check(qt, String);

    var searchables = this.$document.find('.highlight').toArray();
    var markInstance = new Mark(searchables);
    markInstance.mark(qt, {
      className: 'highlightSearch'
    });
  }
};

const name = 'searchResults';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'truncate',
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

  $stateProvider.state('searchResults', {
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
      },
      user($auth) {
        return $auth.awaitUser();
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};