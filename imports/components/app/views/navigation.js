import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { SessionTrackService, SnippetTrackService } from '../../logger/logger';

const name = 'navigation';

class Navigation {
  constructor($scope, $reactive, $state, SnippetTrackService) {
    'ngInject';

    this.$state = $state;
    this.sts = SnippetTrackService;

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

  saveSnippet() {
    this.sts.saveSnippet();
  }

  logout() {
    SessionTrackService.saveLogout();
    Accounts.logout();
    this.$state.go('home');
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  Login,
  Register,
  Password
])
.component(name, {
  template,
  controllerAs: name,
  controller: Navigation
})
.service('SnippetTrackService', SnippetTrackService);