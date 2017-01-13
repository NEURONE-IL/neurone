import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './auth.html';

import { name as DisplayNameFilter } from '../../../filters/displayNameFilter';
import { name as Login } from './login';
import { name as Logout } from './logout';
import { name as Register } from './register';
import { name as Password } from './password';

const name = 'auth';

class Auth {
  constructor($scope, $reactive, $state, $translate, AuthService) {
    'ngInject';

    this.$state = $state;
    this.auth = AuthService;

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

  logout() {
    this.auth.logout((err, res) => {
      if (!err) {
        this.$state.go('home');
      }
    });
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter,
  Login,
  Logout,
  Register,
  Password
])
.component(name, {
  template,
  controllerAs: name,
  controller: Auth
});