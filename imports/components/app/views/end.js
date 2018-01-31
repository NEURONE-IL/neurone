import template from './end.html';

const name = 'end';

class End {
  constructor($scope, $rootScope, $state, $reactive, $timeout, UserDataService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      if (!!Meteor.userId()) {
        Session.set('lockButtons', true);
        Session.set('standbyMode', false);
      }
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      if (!!Meteor.userId()) {
        Session.set('standbyMode', true);
        this.$rootScope.$broadcast('updateNavigation');  
      }
    });

    $reactive(this).attach($scope);

    $timeout(() => {
      this.$state.go('logout');
    }, 5000);
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template: template.default,
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
           stst = 'end';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      }
    }
  });
};