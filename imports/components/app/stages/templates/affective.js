import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './affective.html';

class Affective {
  constructor($scope, $stateParams, $rootScope, $reactive, $translate, $timeout, UserDataService, EventTrackService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;

    this.uds = UserDataService;
    this.ets = EventTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);

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
        stageHome: '#'
      }, (err, res) => {
        if (!err) {
          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          //this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });
          this.$rootScope.$broadcast('updateNavigation');

          console.log('AffectiveQuestionnaire loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    $rootScope.$on('readyAffective', (event, data) => {
      this.submit();
    });

    var stageNumber = this.uds.getSession().currentStageNumber;

    this.msg1 = true;
    this.msg2 = true;
    this.msg3 = false;
    this.msg4 = false;
    this.msg5 = false;
    
    this.$timeout(() => { this.msg1 = true; }, 1000);
    this.$timeout(() => { this.msg2 = true; }, 1250);

    this.$timeout(() => {
      $scope.$watch(() => this.scale1.$valid, (newVal, oldVal) => {
        if (newVal === true) {
          this.$timeout(() => { this.msg3 = true; }, 500);
          this.$timeout(() => { this.msg4 = true; }, 750);

          this.$timeout(() => {
            $scope.$watch(() => this.scale2.$valid, (newVal, oldVal) => {
              if (newVal === true) {
                this.$timeout(() => {
                  this.msg5 = true;
                  this.uds.setSession({ readyButton: true });
                }, 500);
              }
            });
          }, 1000);
        }
      });
    }, 1500);
  }

  submit() {
    var answers = {
      positiveness: this.scale1response,
      calmness: this.scale2response
    }

    var response = {
      userId: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().emails[0].address,
      action: 'AnsweredSAM',
      localTimestamp: Utils.getTimestamp(),
      extras: {
        stage: this.$stateParams.stage,
        answers: answers
      }
    };

    console.log(response);

    this.call('storeCustomEvent', response, (err,res) => {
      if (!err) {
        console.log('Success!');
      }
      else {
        console.error('Error while saving Stage0 answers', err);
      }
    });
  }
}

const name = 'affective';

export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: Affective
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('affective', {
    url: '/affective?stage',
    template: '<affective></affective>',
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
                stst = 'affective';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      }
    }
  });
};