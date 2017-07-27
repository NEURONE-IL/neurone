import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';
import ngCSV from 'ng-csv';
import ngFileUpload from 'ng-file-upload';
import RandomString from 'randomstring';

import Utils from '../globalUtils';
import Configs from '../globalConfigs';

import { name as Enrollment } from './admin/enrollment';
import { name as ContentCreator } from './admin/contentCreator';
import { name as FlowManager } from './admin/flowManager';
import { name as DocumentViewer } from './admin/documentViewer';
import { name as DocumentGenerator } from './admin/documentGenerator';

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
  'ngFileUpload',
  Enrollment,
  ContentCreator,
  FlowManager,
  DocumentViewer,
  DocumentGenerator
])
.component(name, {
  template: template.default,
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
      'contentCreator@admin': {
        template: '<content-creator></content-creator>'
      },
      'flowManager@admin': {
        template: '<flow-manager></flow-manager>'
      },
      'docViewer@admin': {
        template: '<document-viewer></document-viewer>'
      },
      'docGenerator@admin': {
        template: '<document-generator></document-generator>'
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