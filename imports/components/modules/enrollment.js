import angularTruncate from 'angular-truncate-2';
import RandomString from 'randomstring';

import Utils from '../globalUtils';
import Configs from '../globalConfigs';

import { Documents } from '../../api/documents/index';

import template from './enrollment.html';

class Enrollment {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $promiser, UserDataService, AuthService) {
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
          console.log('Enrollment loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    this.userList = [];
  }

  generateCredentials() {
    let tempClasification = {
      test: false,    // [Boolean] Is a test account
      university: 0,  // [one-digit Integer] University Code
      school: 0,      // [two-digit Integer] School Code
      domain: '',     // [two-char String] Search Domain (for iFuCo: [SS]SocialScience, [SC]Science)
      task: '',       // [Char] Task type (for iFuCo: [E]Email, [A]Article)
      studyStage: 0,  // [one-digit Integer] Study Stage (for iFuCo: [1]Pretest, [2]Posttest)
      order: 0,       // [one-digit Integer] Study Order of Application (for iFuCo: [1]First, [2]Second)
      userId: 0       // [four-digit Integer] User Id
    };

    let tempCredentials = {
      username: '',
      password: '',
      role: 'student',
      configs: {},
      session: {},
      profile: {}
    };
  }
}

const name = 'enrollment';

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Enrollment
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('enrollment', {
    url: '/neuroneEnrollment',
    template: '<enrollment></enrollment>',
    resolve: {
      userData(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      currentUser($q, userData) {
        if (Meteor.userId() === null && Meteor.user().role !== 'researcher') {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};