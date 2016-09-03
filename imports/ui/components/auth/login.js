import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import { KMTrack } from '../../../lib/kmtrack';

import template from './login.html';

import { name as Register } from './register';

class Login {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      email: '',
      password: ''
    };

    this.error = '';
  }

  login() {
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
        } else {
          KMTrack.start();
          this.$state.go('search');
        }
      })
    );
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
