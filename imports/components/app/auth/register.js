import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import template from './register.html';

import Settings from '../../../sharedSettings';

class Register {
  constructor($scope, $reactive, $state, AuthService) {
    'ngInject';

    this.$state = $state;
    this.auth = AuthService;

    $reactive(this).attach($scope);

    this.credentials = {
      username: '',
      email: '',
      password: '',
      role: '',
      configs: {},
      session: {},
      profile: {}
    };

    this.error = '';
  }

  register(userRole) {
    this.credentials.role = userRole || 'undefined';
    this.credentials.configs.maxBookmarks = Settings.locale || 'en';
    this.credentials.configs.maxBookmarks = Settings.maxBookmarks || 3;
    this.credentials.configs.snippetsPerPage = Settings.snippetsPerPage || 3;
    this.credentials.configs.snippetLength = Settings.snippetLength || 15;
    
    this.auth.register(this.credentials, (err, res) => {
      if (!err) {
        this.error = res;
        this.$state.go('start');
      }
      else {
        this.error = err;
      } 
    });
  }
}

const name = 'register';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    template,
    controllerAs: name,
    controller: Register
  })
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider.state('register', {
    url: '/register',
    template: '<register></register>'
  });
}
