import template from './start.html';

import Configs from '../../globalConfigs';

const name = 'start';

class Start {
  constructor($scope, $rootScope, $reactive, $state, UserDataService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

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
      var currentState = this.uds.getSession().stageHome;
      
      if (!currentState) {
        if (Configs.flowEnabled) this.fs.startFlow();
        this.$state.go('stage0');
      }
      else {
        if (Configs.flowEnabled) this.fs.startFlow();
        var state = currentState.substr(currentState.indexOf('/') + 1);
        this.$state.go(state);
      }

      /*
      var currentStage = this.uds.getCurrentStage();

      if (!currentStage) {
        var 

      }
      else {
        var stage = this.uds.getCurrentStageData().home;

        var state = stage.substr(stage.indexOf('/') + 1);
        this.$state.go(state);
      }
      */
    }
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template,
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
      user($auth) {
        return $auth.awaitUser();
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};