import ngFileUpload from 'ng-file-upload';

import { name as AdminHome } from './admin/adminHome';
import { name as ContentCreator } from './admin/contentCreator';
import { name as FormBuilder } from './admin/formBuilder';
import { name as DocumentLoader } from './admin/documentLoader';
import { name as DocumentManager } from './admin/documentManager';
import { name as DocumentView } from './admin/documentView';
import { name as VideoLoader } from './admin/videoLoader';
import { name as BookLoader } from './admin/bookLoader';
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
      Session.set('standbyMode', false);
      this.uds.setSession({
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {});
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      Session.set('standbyMode', true);
      this.uds.setSession({
        readyButton: false,
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
  'truncate',
  'ngCsv',
  'ngFileUpload',
  AdminHome,
  ContentCreator,
  FormBuilder,
  DocumentLoader,
  DocumentManager,
  DocumentView,
  VideoLoader,
  BookLoader,
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
      'bookLoader@admin': {
        template: '<book-loader></book-loader>'
      },
      'videoLoader@admin': {
        template:'<video-loader></video-loader>'
      },
      'studyManager@admin': {
        template: '<study-manager></study-manager>'
      },
      'enrollment@admin': {
        template: '<enrollment></enrollment>'
      }
    },
    resolve: {
      userLogged($q) {
        if (!!Meteor.userId()) return $q.resolve();
        else return $q.reject('AUTH_REQUIRED');
      },
      dataReady(userLogged, $q, UserDataService) {
        let uds = UserDataService;
        return uds.ready().then(
          (res) => { return $q.resolve() },
          (err) => { return $q.reject('USERDATA_NOT_READY') }
        );
      },
      checkAdmin(dataReady, $q, UserDataService) {
        let uds = UserDataService;
        if (uds.getRole() === 'researcher') return $q.resolve();
        else return $q.reject('NO_ADMIN');
      }
    }
  });
};