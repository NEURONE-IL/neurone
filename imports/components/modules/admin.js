import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';
import multiSelect from 'angular-bootstrap-multiselect';
import ngCSV from 'ng-csv';
import ngFileUpload from 'ng-file-upload';
import RandomString from 'randomstring';

import Utils from '../globalUtils';
import Configs from '../globalConfigs';

import { name as AdminHome } from './admin/adminHome';
import { name as ContentCreator } from './admin/contentCreator';
import { name as FormBuilder } from './admin/formBuilder';
import { name as DocumentLoader } from './admin/documentLoader';
import { name as DocumentManager } from './admin/documentManager';
import { name as StudyManager } from './admin/studyManager';
import { name as Enrollment } from './admin/enrollment';

import template from './admin.html';

class Admin {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $promiser, UserDataService, AuthService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.auth = AuthService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({
        readyButton: false,
        standbyMode: false,
        statusMessage: ''
      }, (err, res) => {});
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        readyButton: false,
        standbyMode: true,
        statusMessage: '',
        stageHome: 'start'
      }, (err, res) => {});
    });

    $reactive(this).attach($scope);
  }
}

const name = 'admin';

export default angular.module(name, [
  'ngSanitize',
  'btorfs.multiselect',   // angular-bootstrap-multiselect
  'truncate',
  'ngCsv',
  'ngFileUpload',
  AdminHome,
  ContentCreator,
  FormBuilder,
  DocumentLoader,
  DocumentManager,
  StudyManager,
  Enrollment
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
    url: '/admin',
    views: {
      '@': {
        template: '<admin></admin>'
      },
      'adminHome@admin': {
        template: '<admin-home></admin-home>'
      },
      'contentCreator@admin': {
        template: '<content-creator></content-creator>'
      },
      'formBuilder@admin': {
        template: '<form-builder></form-builder>'
      },
      'docLoader@admin': {
        template: '<document-loader></document-loader>'
      },
      'docManager@admin': {
        template: '<document-manager></document-manager>'
      },
      'studyManager@admin': {
        template: '<study-manager></study-manager>'
      },
      'enrollment@admin': {
        template: '<enrollment></enrollment>'
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
            if (uds.getRole() === 'researcher') return $q.resolve();
            else return $q.reject('NO_ADMIN');
          });
        }
      }
    }
  });
};