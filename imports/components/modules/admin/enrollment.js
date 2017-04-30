import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';
import angularCSV from 'ng-csv';
import RandomString from 'randomstring';

import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './enrollment.html';

class Enrollment {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $promiser, UserDataService, AuthService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.auth = AuthService;

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
    this.allUppercaseRegex = /^[A-Z]*$/;
  }

  generateUsers() {
    if (this.form.$valid) {
      this.userList = [];

      let start = this.idStart,
            end = this.idEnd;

      for (var id = start; id <= end; id++) {
        let tempUser = {
          test: this.testAct,           // [Boolean] Is a test account
          university: this.university,  // [one-digit Integer] University Code
          school: this.school,          // [two-digit Integer] School Code
          class: this.class,              // [Char] Class number code
          domain: this.domain,          // [two-char String] Search Domain (for iFuCo: [SS]SocialScience, [SC]Science)
          task: this.task,              // [Char] Task type (for iFuCo: [E]Email, [A]Article)
          studyStage: this.studyStage,  // [one-digit Integer] Study Stage (for iFuCo: [1]Pretest, [2]Posttest)
          studyOrder: this.studyOrder,  // [one-digit Integer] Study Order of Application (for iFuCo: [1]First, [2]Second)
          userId: id,                   // [four-digit Integer] User Id
          status: 'NotChecked'
        };

        tempUser.password = RandomString.generate({ length: 4, readable: true, charset: 'numeric' });

        tempUser.username = (tempUser.test === 'true' ? 't' : '') +
                            tempUser.university +
                            this.zeroPad(2, tempUser.school, true) +
                            tempUser.class +
                            tempUser.domain + 
                            tempUser.task + 
                            tempUser.studyStage +
                            tempUser.studyOrder +
                            this.zeroPad(4, tempUser.userId, true);

        this.userList.push(tempUser);
      }
    }
    else {
      console.error('Invalid user form!');
    }
  }

  registerUsers() {
    console.log('Calling mass user register!', this.userList.length);

    this.call('registerUsers', this.userList, (err, res) => {
      if (!err) {
        this.userList = res;
      }
      else {
        console.log(err);
      }
    });
  }

  // dgacitua: Modified from http://stackoverflow.com/a/24398129
  zeroPad(amount, str, padLeft) {
    var pad = Array(amount+1).join('0');

    if (typeof str === 'undefined') return pad;

    if (padLeft) return (pad + str).slice(-pad.length);
    else return (str + pad).substring(0, pad.length);
  }
}

const name = 'enrollment';

// create a module
export default angular.module(name, [
  'ngSanitize',
  'truncate',
  'ngCsv'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Enrollment
});
/*
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
*/