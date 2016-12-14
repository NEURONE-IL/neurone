import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './search.html';

import { name as Logger } from '../logger/logger';

import { name as SearchResults } from './actions/searchResults';
import { name as DisplayPage } from './actions/displayPage';
import { name as DisplayIframe } from './iframe/displayIframe';

class Search {
  constructor($scope, $rootScope, $reactive, $state, UserDataService, QueryTrackService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.qts = QueryTrackService;
    this.uds = UserDataService;

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

  $stateProvider.state('search', {
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