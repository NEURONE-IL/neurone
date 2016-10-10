import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as Logger } from '../../logger/logger';

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $q, $reactive, $state, BookmarkTrackService, SnippetTrackService, SessionTrackService) {
    'ngInject';

    this.$q = $q;
    this.$state = $state;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;

    $reactive(this).attach($scope);

    this.navbarMessage = 'TEST!';

    $rootScope.$on('setRelevantPageButton', (event, data) => {
      this.isOnPage = data;
    });

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      enablePageHelpers() {
        return this.isOnPage;
      }
    });
  }

  saveSnippet() {
    this.sts.saveSnippet();
  }

  saveBookmark() {
    this.bms.saveBookmark();
  }

  logout() {
    var p1 = this.ses.saveLogout();
    var p2 = Accounts.logout();

    this.$q.all([p1, p2]).then(this.$state.go('home'));
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  Logger,
  Login,
  Register,
  Password
])
.component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});