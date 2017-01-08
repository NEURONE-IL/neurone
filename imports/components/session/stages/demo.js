import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './demo.html';

class Demo {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, UserDataService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      console.log('Demo Success');
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ statusMessage: '' });
      this.uds.setSession({ stageHome: '#' });
      //this.uds.setSession({ stageNumber: 'demo' });

      var stageNumber = this.uds.getSession().currentStageNumber,
         currentStage = this.uds.getConfigs().stages[stageNumber];

      this.uds.setSession({ currentStageName: currentStage.id });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
    
    var stageName = this.uds.getSession().currentStageName,
      stageNumber = this.uds.getSession().currentStageNumber;

    this.demoPage = this.uds.getConfigs().stages[stageNumber].page;

    this.$timeout(() => {
      if (stageName !== 'end') this.uds.setSession({ readyButton: true });
    }, Configs.instructionTimeout);
  }
}

const name = 'demo';

// create a module
export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: Demo
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('demo', {
    url: '/demo?stage',
    template: '<demo></demo>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      },
      user($auth) {
        return $auth.awaitUser();
      }
    }
  });
};