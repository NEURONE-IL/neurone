import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import Utils from '../../globalUtils';

import template from './stage1.html';

class Stage1 {
  constructor($scope, $rootScope, $reactive, $document, $state, $stateParams, UserDataService, QueryTrackService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$document = $document;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;

    this.uds = UserDataService;
    this.qts = QueryTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: false });
      this.uds.setSession({ readyButton: false });
      //this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: true });
      this.uds.setSession({ stageHome: '/stage1' });
      this.uds.setSession({ statusMessage: '' });
      
      // TODO optimize code
      var limit = this.uds.getConfigs().minBookmarks;
      var setReady = !!(this.uds.getSession().bookmarkCount >= limit);
      this.uds.setSession({ readyButton: setReady });

      var stageNumber = this.uds.getSession().currentStageNumber,
         currentStage = this.uds.getConfigs().stages[stageNumber];

      this.uds.setSession({ currentStageName: currentStage.id });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    this.searchText = '';
    this.firstSearch = false;
    this.resultsReady = false;
    this.getResults(this.$stateParams.query);
  }

  doSearch() {
    var queryText = this.searchText.toString();
    this.getResults(queryText);
  }

  getResults(queryText) {
    if (!Utils.isEmpty(queryText)) {
      this.firstSearch = true;
      this.qts.saveQuery(queryText);
      this.$state.go('.', {query: queryText}, {notify: false});

      this.call('searchDocuments', queryText, function(err, res) {
        if (!err) {
          this.documents = res;

          // dgacitua: Pagination
          this.totalResults = this.documents.length;
          this.currentPage = 1;
          this.resultsPerPage = 10;
          this.paginationMaxSize = 5;

          // dgacitua: Apply changes
          this.resultsReady = true;
          this.$scope.$apply();

          this.highlightSearch(queryText);
          this.$scope.$apply();
        }
        else {
          console.error(err);
          this.resultsReady = true;
          this.$scope.$apply();
        }
      });
    }
  }

  highlightSearch(queryText) {
    var qt = queryText ? queryText : '';
    check(qt, String);

    var searchables = this.$document.find('.highlight').toArray();
    var markInstance = new Mark(searchables);

    // dgacitua: Unmark old results
    markInstance.unmark();
    this.$scope.$apply();

    // dgacitua: Mark new results
    markInstance.mark(qt, { className: 'highlightSearch' });
    this.$scope.$apply();
  }
}

const name = 'stage1';

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage1
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage1', {
    url: '/stage1?query',
    template: '<stage1></stage1>',
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