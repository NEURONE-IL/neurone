import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import Utils from '../../globalUtils';

import template from './logout.html';

import { name as Register } from './register';

class Logout {
  constructor($scope, $rootScope, $reactive, $state, AuthService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.auth = AuthService;

    $reactive(this).attach($scope);

    this.logout();
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
  angularMeteor,
  uiRouter
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
    template: '<logout></logout>'
  });
}
