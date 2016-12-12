import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import Utils from '../../globalUtils';

import template from './login.html';

import { name as Register } from './register';

class Login {
  constructor($scope, $rootScope, $reactive, $state, AuthService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.auth = AuthService;

    $reactive(this).attach($scope);

    this.credentials = {
      username: '',
      password: ''
    };

    this.error = '';
  }

  login() {
    this.auth.login(this.credentials.username, this.credentials.password, (err, res) => {
      if (!err) {
        this.error = res;
        this.$state.go('home');
      }
      else {
        this.error = err;
      }
    });
  }
}

const name = 'login';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: Login
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>'
  });
}
