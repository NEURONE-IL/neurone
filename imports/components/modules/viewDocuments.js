import angularTruncate from 'angular-truncate-2';

import Utils from '../globalUtils';
import Configs from '../globalConfigs';

import { Documents } from '../../database/documents/index';

import template from './viewDocuments.html';

class ViewDocuments {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $promiser, UserDataService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          // dgacitua: Do nothing for now
        }
        else {
          console.error('Error while unloading Stage!', err);
        }
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        readyButton: false,
        statusMessage: '',
        stageHome: 'start'
      }, (err, res) => {
        if (!err) {
          console.log('ViewDocuments loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    // dgacitua: Pagination
    this.documents = Documents.find({ $or: [ { test: { $ne: 'pilot' }}, { topic: { $ne: 'pilot' }} ] }).fetch();
    this.totalResults = this.documents.length;
    this.currentPage = 1;
    this.resultsPerPage = 10;
    this.paginationMaxSize = 5;
  }
}

const name = 'viewDocuments';

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: ViewDocuments
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('viewDocuments', {
    url: '/neuroneViewAllDocs',
    template: '<view-documents></view-documents>',
    resolve: {
      userData(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      currentUser($q, UserDataService, userData) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          return dfr.then((res) => {
            if (uds.getRole() !== 'researcher') return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      },
      documentSub($promiser, currentUser) {
        return $promiser.subscribe('documents');
      }
    }
  });
};