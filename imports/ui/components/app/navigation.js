import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { KMTrack } from '../../../lib/kmtrack';

import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import '../../../lib/init';
import '../../../lib/kmtrack';

const name = 'navigation';

class Navigation {
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
]).component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});