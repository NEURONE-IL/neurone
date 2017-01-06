import Utils from '../../globalUtils';

import template from './stage0.html';

class StagePre0 {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, UserDataService) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ readyButton: false });
      //this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ stageHome: '/stagere0' });
      this.uds.setSession({ stageNumber: 'stagePre0' });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
    
    $timeout(() => {
      $scope.$watch(() => this.queryIdeasForm.$valid, (newVal, oldVal) => {
        if (newVal) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);
  }
}

const name = 'stagepre0';

// create a module
export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: StagePre0
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stagepre0', {
    url: '/stagepre0',
    template: '<stagepre0></stagepre0>',
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
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};