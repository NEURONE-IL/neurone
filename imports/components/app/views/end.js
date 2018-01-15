import template from './end.html';

const name = 'end';

class End {
  constructor($scope, $rootScope, $state, $reactive, UserDataService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

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
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          return dfr.then((res) => {
            var cstn = uds.getSession().currentStageNumber,
                csst = uds.getConfigs().stages[cstn].state,
                cstp = uds.getConfigs().stages[cstn].urlParams,
                stst = 'end';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      },
      logout($q, AuthService, stageLock) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          const auth = AuthService;

          return auth.logout((err, res) => {
            if (!err) return $q.resolve();
            else return $q.reject('WRONG_STAGE');
          })
        }
      }
    }
  });
};