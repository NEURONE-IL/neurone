import Utils from '../../globalUtils';

import template from './logout.html';

import { name as Register } from './register';

class Logout {
  constructor($scope, $rootScope, $reactive, $state, $timeout, AuthService, UserDataService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.auth = AuthService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      Session.set('standbyMode', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      Session.set('standbyMode', true);
      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    $timeout(this.logout(), 1000);
  }

  logout() {
    this.auth.logout((err, res) => {
      if (!err) {
        this.$state.go('home');
      }
    });
  }
}

const name = 'logout';

// create a module
export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Logout
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('logout', {
    url: '/logout',
    template: '<logout></logout>',
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
      }
    }
  });
}
