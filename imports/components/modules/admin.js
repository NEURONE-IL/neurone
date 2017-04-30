import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';
import angularCSV from 'ng-csv';
import angularFileUpload from 'angular-file-upload';
import RandomString from 'randomstring';

import Utils from '../globalUtils';
import Configs from '../globalConfigs';

import { name as Enrollment } from './admin/enrollment';
import { name as FlowManager } from './admin/flowManager';

import template from './admin.html';

class Admin {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $promiser, UserDataService, AuthService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.auth = AuthService;

    $reactive(this).attach($scope);
  }
}

const name = 'admin';

export default angular.module(name, [
  'ngSanitize',
  'truncate',
  'ngCsv',
  'angularFileUpload',
  Enrollment,
  FlowManager
])
.component(name, {
  template,
  controllerAs: name,
  controller: Admin
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/neuroneAdmin',
    views: {
      '@': {
        template: '<admin></admin>'
      },
      'enrollment@admin': {
        template: '<enrollment></enrollment>'
      },
      'flowManager@admin': {
        template: '<flow-manager></flow-manager>'
      }
    },
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
      }
    }
  });
};