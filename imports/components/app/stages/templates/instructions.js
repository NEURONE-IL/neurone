import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './instructions.html';

class Instructions {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, $state, UserDataService, AuthService) {
    'ngInject';

    this.$state = $state;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.auth = AuthService;

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

          console.log('Instructions loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);
    
    var stageName = this.uds.getSession().currentStageName,
      stageNumber = this.uds.getSession().currentStageNumber;

    this.avatar = this.uds.getConfigs().avatar;
    this.instructionsPage = this.uds.getConfigs().stages[stageNumber].page;

    this.$timeout(() => {
      if (stageName !== 'end') this.uds.setSession({ readyButton: true });
    }, Configs.instructionTimeout);

    this.$timeout(() => {
      if (stageName === 'end') {
        this.auth.logout((err, res) => {
          if (!err) {
            this.$state.go('home');
          }
        });
      }
    }, Configs.autoLogout);
  }
}

const name = 'instructions';

// create a module
export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Instructions
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('instructions', {
    url: '/instructions?stage',
    template: '<instructions></instructions>',
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
           stst = 'instructions';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      }
    }
  });
};