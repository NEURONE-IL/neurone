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
      //var currentState = this.uds.getSession().stageHome;
      var currentStageNumber = this.uds.getSession().currentStageNumber;

      if (!currentStageNumber) {
        this.uds.setSession({ currentStageNumber: 0 });
        var currentStage = this.uds.getConfigs().stages[0];

        this.uds.setSession({ currentStageName: currentStage.id, currentStageNumber: 0 }, (err, res) => {
          if (!err) {
            if (Configs.flowEnabled) this.fs.startFlow();
            this.$state.go(currentStage.state, currentStage.urlParams);
          }  
        });
        
      }
      else {
        var currentStage = this.uds.getConfigs().stages[currentStageNumber];
        this.uds.setSession({ currentStageName: currentStage.id, currentStageNumber: currentStageNumber }, (err, res) => {
          if (!err) {
            if (Configs.flowEnabled) this.fs.startFlow();
            this.$state.go(currentStage.state, currentStage.urlParams);
          }  
        });

        //var state = currentState.substr(currentState.indexOf('/') + 1);
        //this.$state.go(state);
      }
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
      }
    }
  });
};