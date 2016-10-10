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

    console.log('RelevantPage3', $rootScope.isOnPage);

    this.$q = $q;
    this.$state = $state;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;

    $rootScope.$on('setRelevantPageButton', function(event, data) {
      $rootScope.isOnPage = data;
      console.log('isOnPage', data, $rootScope.isOnPage);
    });

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      isVisitingDocument() {
        console.log('isOnPage', $rootScope.isOnPage);
        return !!$rootScope.isOnPage;
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