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
      this.uds.setSession({ standbyMode: false });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ standbyMode: true });
      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    $timeout(() => {
      this.logout();
    }, 1500);
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
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      currentUser($q, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
}
