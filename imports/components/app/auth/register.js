import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import { FlowElements } from '../../../database/flowElements/index';

import template from './register.html';

class Register {
  constructor($scope, $reactive, $state, $translate, AuthService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$translate = $translate;

    this.auth = AuthService;
    this.uds = UserDataService;

    $reactive(this).attach($scope);

    this.subscribe('flows');

    this.helpers({
      flows: () => FlowElements.find()
    });

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
    if (userRole === 'student' && this.studentForm.$valid) {
      let loadedFlow = angular.copy(this.flow);
      delete this.flow;

      this.credentials.role = userRole || 'undefined';
      this.credentials.configs = loadedFlow;

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
    else if (userRole === 'researcher' && this.researcherForm.$valid) {
      this.credentials.role = userRole || 'undefined';
      this.credentials.configs = {};

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
    else {
      console.error('Form not valid!');
    }
  }
}

const name = 'register';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    template: template.default,
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
