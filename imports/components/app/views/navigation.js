import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { SessionTrackService, SnippetTrackService, BookmarkTrackService } from '../../logger/logger';

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $reactive, $state, BookmarkTrackService, SnippetTrackService) {
    'ngInject';

    console.log('RelevantPage3', $rootScope.isOnPage);

    this.$state = $state;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;

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
.service('SnippetTrackService', SnippetTrackService)
.service('BookmarkTrackService', BookmarkTrackService);