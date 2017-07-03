import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import template from './register.html';

import Settings from '../../../sharedSettings';

class Register {
  constructor($scope, $reactive, $state, $translate, AuthService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$translate = $translate;

    this.auth = AuthService;
    this.uds = UserDataService;

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
    this.call('initialConfigs', (err, res) => {
      if (!err)  {
        this.credentials.role = userRole || 'undefined';
        this.credentials.configs = res;
        
        this.auth.register(this.credentials, (err2, res2) => {
          if (!err2) {
            this.error = res2;
            this.$state.go('start');

            /*
            this.uds.ready().then(() => {
              var locale = this.uds.getConfigs().locale;

              this.$translate.use(locale).then(() => {
                this.$state.go('start');  
              });
            });
            */
          }
          else {
            this.error = err2;
          } 
        });  
      }
      else {
        console.error(err);
      }
    })
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
