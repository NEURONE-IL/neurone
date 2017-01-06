import template from './end.html';

const name = 'end';

class End {
  constructor($scope, $rootScope, $state, $reactive, UserDataService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ standbyMode: false });
      //this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ standbyMode: true });
      this.uds.setSession({ stageHome: '/end' });
      this.uds.setSession({ stageNumber: 4 });
      this.uds.setSession({ finished: true });
      this.uds.setSession({ totalTimer: 0, stageTimer: 0 });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template,
  controllerAs: name,
  controller: End
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('end', {
    url: '/end',
    template: '<end></end>',
    resolve: {
      user($auth) {
        return $auth.awaitUser();
      },
      /*userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }*/
    }
  });
};