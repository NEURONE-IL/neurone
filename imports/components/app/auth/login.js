import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './login.html';

import { name as Register } from './register';

import { name as Logger } from '../../logger/logger';

class Login {
  constructor($scope, $reactive, $state, SessionTrackService, FlowService) {
    'ngInject';

    this.$state = $state;
    this.sts = SessionTrackService;
    this.fs = FlowService;

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
          //console.log(Meteor.user(), Meteor.user().emails[0].address);
          this.sts.saveLogin();
          this.fs.startFlow();
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
  uiRouter,
  Logger
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
