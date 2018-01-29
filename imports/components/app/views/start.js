import template from './start.html';

import Configs from '../../globalConfigs';

const name = 'start';

class Start {
  constructor($scope, $rootScope, $reactive, $state, $timeout, UserDataService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.fs = FlowService;
    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      if (!!Meteor.userId()) {
        this.uds.setSession({ standbyMode: false });
      }
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      if (!!Meteor.userId()) {
        this.uds.setSession({ standbyMode: true });
        this.$rootScope.$broadcast('updateNavigation');  
      }
    });

    $reactive(this).attach($scope);
  }

  begin() {
    if (!!Meteor.userId()) {
      var currentStageNumber = this.uds.getSession().currentStageNumber;

      if (!currentStageNumber) {
        this.uds.setSession({ currentStageNumber: 0 });
        var currentStage = this.uds.getConfigs().stages[0];

        this.uds.setSession({ currentStageName: currentStage.id, currentStageNumber: 0, currentStageState: currentStage.state }, (err, res) => {
          if (!err) {
            if (Configs.flowEnabled) this.fs.startFlow();
            this.$state.go(currentStage.state, currentStage.urlParams);
          }  
        });
      }
      else {
        var currentStage = this.uds.getConfigs().stages[currentStageNumber];
        this.uds.setSession({ currentStageName: currentStage.id, currentStageNumber: currentStageNumber, currentStageState: currentStage.state }, (err, res) => {
          if (!err) {
            if (Configs.flowEnabled) this.fs.startFlow();
            this.$state.go(currentStage.state, currentStage.urlParams);
          }  
        });
      }
    }
  }

  enableAdmin() {
    if (this.uds.getRole() === 'researcher') return true;
    else return false;
  }

  goToAdminPanel() {
    this.$state.go('admin');
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Start
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('start', {
    url: '/start',
    template: '<start></start>',
    resolve: {
      isUserLogged($q) {
        if (!!Meteor.userId()) return $q.resolve();
        else return $q.reject('AUTH_REQUIRED');
      }/*,
      startReady($q, UserDataService, isUserLogged) {
        let uds = UserDataService;
        uds.ready().then((status) => {
          console.log('UDS STATUS', status);
          if (status === 'USER_LOGGED') return $q.resolve();
          else return $q.reject('USERDATA_NOT_LOADED');
        },
        (err) => {
          return $q.reject('AUTH_REQUIRED');
        });
      }
      */
    }
  });
};