import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './affective.html';

class Affective {
  constructor($scope, $stateParams, $rootScope, $reactive, $translate, $timeout, UserDataService, EventTrackService) {
    'ngInject';

    this.$scope = $scope;
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

    this.readyEvent = this.$rootScope.$on('readyAffective', (event, data) => {
      this.submit();
    });

    this.$onDestroy = () => {
      this.$scope.$on('$destroy', this.readyEvent);
    };

    var stageNumber = this.uds.getSession().currentStageNumber,
       currentStage = this.uds.getConfigs().stages[stageNumber];

    this.answerType = currentStage.answerType;
    this.samTemplate = currentStage.template || currentStage.page;
    this.avatar = this.uds.getConfigs().avatar;
  }

  samChat() {
    this.msg1 = true;
    this.msg2 = true;
    this.msg3 = false;
    this.msg4 = false;
    this.msg5 = false;
    
    this.$timeout(() => { this.msg1 = true; }, 1000);
    this.$timeout(() => { this.msg2 = true; }, 1250);

    this.$timeout(() => {
      this.$scope.$watch(() => this.scale1.$valid, (newVal, oldVal) => {
        if (newVal === true) {
          this.$timeout(() => { this.msg3 = true; }, 500);
          this.$timeout(() => { this.msg4 = true; }, 750);

          this.$timeout(() => {
            this.$scope.$watch(() => this.scale2.$valid, (newVal, oldVal) => {
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
    var answers = [
      { 
        type: 'positiveness',
        answer: this.scale1response
      },
      {
        type: 'calmness',
        answer: this.scale2response
      }
    ];

    var response = {
      userId: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().emails[0].address,
      action: 'AnsweredSAM',
      reason: this.answerType,
      answer: answers,
      localTimestamp: Utils.getTimestamp()
    }

    this.call('storeFormResponse', response, (err, res) => {
      if (!err) {
        console.log('Answers sent to server!', response);
      }
      else {
        console.error('Error while sending answers', err);
      }
    });
  }
}

const name = 'affective';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
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
      stageLock(dataReady, $q, UserDataService) {
        let uds = UserDataService,
           cstn = uds.getSession().currentStageNumber,
           csst = uds.getConfigs().stages[cstn].state,
           cstp = uds.getConfigs().stages[cstn].urlParams,
           stst = 'affective';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      }
    }
  });
};