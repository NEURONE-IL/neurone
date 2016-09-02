import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './login.html';

class Login {}

const name = 'login';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'accounts.ui'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Login
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('login', {
      url: '/login',
      template: '<login></login>'
    });
};