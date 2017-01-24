import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './search.html';

class Search {
  constructor($scope, $rootScope, $reactive, $document, $state, $stateParams, $sanitize, UserDataService, QueryTrackService, EventTrackService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$document = $document;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;

    this.uds = UserDataService;
    this.qts = QueryTrackService;
    this.ets = EventTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      
      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: false,
        backButton: false,
        readyButton: false,
        statusMessage: ''
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: true,
        backButton: false,
        stageHome: '/search',
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          // TODO optimize code
          var limit = this.uds.getConfigs().minBookmarks;
          var setReady = !!(this.uds.getSession().bookmarkCount >= limit);
          this.uds.setSession({ readyButton: setReady });

          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });

          this.$rootScope.$broadcast('updateNavigation');

          console.log('Search loaded!');
        }
        else {
          console.error('Error while loading Search!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    this.searchText = this.$stateParams.query || '';
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

      var queryObj = {
        query: queryText,
        locale: this.uds.getConfigs().locale,
        test: this.uds.getConfigs().test,
        topic: this.uds.getConfigs().topic
      }

      console.log(queryObj);

      this.call('searchDocuments', queryObj, function(err, res) {
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

          //this.highlightSearch(queryText);
          //this.$scope.$apply();
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

  storeEvent(action, params) {
    this.ets.storeCustomEvent(action, params, (err, res) => {});
  }
}

const name = 'search';

// create a module
export default angular.module(name, [
  'ngSanitize',
  'truncate'
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
    url: '/search?query',
    template: '<search></search>',
    resolve: {
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          dfr.then((res) => {
            var cstn = uds.getSession().currentStageNumber,
                csst = uds.getConfigs().stages[cstn].state,
                cstp = uds.getConfigs().stages[cstn].urlParams,
                stst = 'search';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      }
    }
  });
};