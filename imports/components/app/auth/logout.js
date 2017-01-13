import Utils from '../../globalUtils';

import template from './logout.html';

import { name as Register } from './register';

class Logout {
  constructor($scope, $rootScope, $reactive, $state, $timeout, AuthService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.auth = AuthService;

    $reactive(this).attach($scope);

    $timeout(() => {
      this.logout();
    }, 1000);
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
  template,
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
      currentUser($q) {
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
