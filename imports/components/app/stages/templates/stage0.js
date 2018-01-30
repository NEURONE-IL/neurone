import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './stage0.html';

class Stage0 {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, UserDataService) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);

      this.uds.setSession({
        readyButton: false,
        backButton: false,
        statusMessage: ''
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      console.log('Stage0 Success');
      this.uds.setSession({
        readyButton: false,
        backButton: false,
        stageHome: '/stage0'
      }, (err, res) => {
        if (!err) {
          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });

          this.$rootScope.$broadcast('updateNavigation');

          console.log('Stage0 loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    var stageName = this.uds.getSession().currentStageName,
      stageNumber = this.uds.getSession().currentStageNumber;

    this.instructionsPage = this.uds.getConfigs().stages[stageNumber].page;
    
    this.numberIdeas = this.uds.getConfigs().queryIdeas;
    this.ideas = [];
    this.queryIdeasForm = {};
    
    for (var i=0; i<this.numberIdeas; i++) {
      var form = {
        num: (i+1),
        query: ''
      };

      this.ideas.push(form);
    }

    this.stageReady = true;
    
    $rootScope.$on('readyStage0', (event, data) => {
      this.submit();
    });

    $timeout(() => {
      $scope.$watch(() => this.queryIdeasForm.$valid, (newVal, oldVal) => {
        if (newVal === true) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);
  }

  submit() {
    var answers = angular.toJson(this.ideas);

    var response = {
      userId: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().emails[0].address,
      action: 'ReadyStage0',
      localTimestamp: Utils.getTimestamp(),
      extras: { answers: answers }
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

const name = 'stage0';

// create a module
export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Stage0
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage0', {
    url: '/stage0',
    template: '<stage0></stage0>',
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
           stst = 'stage0';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      }
    }
  });
};