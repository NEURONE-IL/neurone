import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './searchPage.html';

import { name as SearchPageResults } from './actions/searchResults';
import { name as DisplayPage } from './actions/displayPage';

class SearchPage {
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
      //this.uds.setSession({ stageHome: '/home' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      //this.$rootScope.$broadcast('updateBookmarkList', true);
      var limit = this.uds.getConfigs().maxBookmarks;
      var setReady = !!(this.uds.getSession().bookmarkCount >= limit);

      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: true });
      this.uds.setSession({ stageNumber: 1 });
      this.uds.setSession({ readyButton: setReady });
      this.uds.setSession({ stageHome: '/searchPage' });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    this.searchText = '';
  }

  doSearch() {
    var queryText = this.searchText.toString() || '';
    this.qts.saveQuery(queryText);
    this.$state.go('searchResults', {query: queryText});
  }
}

const name = 'searchPage';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  SearchPageResults,
  //DisplayPage
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: SearchPage
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('searchPage', {
    url: '/searchPage',
    template: '<search-page></search-page>',
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
      }
    }
  });
};