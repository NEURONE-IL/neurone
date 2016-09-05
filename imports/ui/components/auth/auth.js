import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './auth.html';

import { KMTrack } from '../../../lib/kmtrack';

import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as Login } from './login';
import { name as Register } from './register';
import { name as Password } from './password';

const name = 'auth';

class Auth {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

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
    //KMTrack.stop();
    Accounts.logout();
    this.$state.go('home');
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter,
  Login,
  Register,
  Password
])
.component(name, {
  template,
  controllerAs: name,
  controller: Auth
});