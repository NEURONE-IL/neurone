import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as ModalService } from '../../modules/modal';

import { name as Logger } from '../../logger/logger';
import Utils from '../../globalUtils';

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $reactive, $state, AuthService, BookmarkTrackService, SnippetTrackService, SessionTrackService, FlowService, ModalService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.fs = FlowService;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;
    this.auth = AuthService;
    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.isSnippetEnabled = false;
    this.isBookmarkEnabled = false;
    this.isPageBookmarked = false;
    this.isShowcaseEnabled = false;

    this.navbarMessage = '';
    this.navbarMessageId = 'navbarMessage';

    this.reactiveCounters = {
      bookmarkedPages: 0,
      snippetsPerPage: 0,
      snippetLength: 0
    };

    this.userBookmarks = [];

    this.$scope.$on('$stateChangeSuccess', (event) => {
      this.navbarMessage = '';
    });

    this.$rootScope.$on('setDocumentHelpers', (event, data) => {
      this.bms.isBookmarked((err, res) => {
        if (!err) {
          this.isSnippetEnabled = data.snippets;
          this.isBookmarkEnabled = data.bookmarks;
          this.isPageBookmarked = res;
          this.$scope.$apply();
          //console.log('Bookmark Check!', this.isSnippetEnabled, this.isBookmarkEnabled, this.isPageBookmarked);
        }
        else {
          console.error(err);
        }
      });
    });

    this.$rootScope.$on('sessionRefresh', (event, data) => {
      if (data) {
        this.reactiveLimits = this.getUserLimits();

        this.bms.getBookmarks((err, res) => {
          if (!err) {
            this.userBookmarks = res;
            this.reactiveCounters.bookmarkedPages = this.userBookmarks.length;
          }          
        });
      }
      else {
        this.reactiveLimits = {};
        this.userBookmarks = [];
      }
    });

    this.helpers({
      isLoggedIn: () => {
        return !!Meteor.userId();
      },
      currentUser: () => {
        return Meteor.user();
      },
      statusMessage: () => {
        return this.getReactively('navbarMessage');
      },
      counters: () => {
        return this.getReactively('reactiveCounters');
      },
      limits: () => {
        return this.getReactively('reactiveLimits');
      },
      enableShowcase: () => {
        return this.getReactively('isShowcaseEnabled');
      },
      enableSnippet: () => {
        return this.getReactively('isSnippetEnabled');
      },
      enableBookmark: () => {
        return this.getReactively('isBookmarkEnabled');
      },
      bookmarkStatus: () => {
        return this.getReactively('isPageBookmarked');
      }
    });
  }

  saveSnippet() {
    this.sts.saveSnippet((err, res) => {
      this.navbarMessage = res ? res : err;
      Utils.notificationFadeout(this.navbarMessageId);
      this.$scope.$apply();
    });
  }

  saveBookmark() {
    this.bms.saveBookmark((err, res) => {
      this.navbarMessage = res ? res : err;
      Utils.notificationFadeout(this.navbarMessageId);
      this.$scope.$apply();
      
      if (!err) {
        this.bms.isBookmarked((err2, res2) => {
          if (!err2) {
            this.isPageBookmarked = res2;
            this.reactiveCounters.bookmarkedPages++;
            this.$scope.$apply();
          }
        });
      }
    });
  }

  removeBookmark() {
    this.bms.removeBookmark((err, res) => {
      this.navbarMessage = res ? res : err;
      Utils.notificationFadeout(this.navbarMessageId);
      this.$scope.$apply();

      if (!err) {
        this.bms.isBookmarked((err2, res2) => {
          if (!err2) {
            this.isPageBookmarked = res2;
            this.reactiveCounters.bookmarkedPages--;
            this.$scope.$apply();
          }
        });
      }
    });
  }

  getUserLimits() {
    var limits = {
      bookmarkedPages: this.$rootScope.maxBookmarks || 0,
      snippetsPerPage: this.$rootScope.snippetsPerPage || 0,
      snippetLength: this.$rootScope.snippetLength || 0
    };

    return limits;
  }

  logout() {
    this.auth.logout((err, res) => {
      if (!err) {
        this.$state.go('home');
      }
    });
  }

  taskModal() {
    // dgacitua: Modal template location is relative to NEURONE's Asset Path
    var modalObject = {
      title: 'My Email',
      templateAsset: 'modals/taskAssignment_en.html',
      fields: {
        to: (!!Meteor.userId() ? (Meteor.user().username || Meteor.user().emails[0].address) : 'you'),
        subject: 'I need your help!'
      }
    };

    this.modal.openModal(modalObject);
  }

  tipsModal() {
    // dgacitua: Modal template location is relative to NEURONE's Asset Path
    var modalObject = {
      title: 'Tips',
      templateAsset: 'modals/tips_stage1_en.html',
      fields: {}
    };

    this.modal.openModal(modalObject);
  }

  tutorialModal() {
    // dgacitua: Modal template location is relative to NEURONE's Asset Path
    var modalObject = {
      title: 'Tutorial',
      templateAsset: 'modals/tutorial_stage1_en.html',
      fields: {}
    };

    this.modal.openModal(modalObject);
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  Logger,
  Login,
  Register,
  Password,
  ModalService
])
.component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});