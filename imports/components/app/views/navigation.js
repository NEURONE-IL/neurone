import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as ModalService } from '../../modules/modal';

import { name as Logger } from '../../logger/logger';
import Utils from '../../globalUtils';

/*
    dgacitua

    Module Dependencies:
        angularTranslate
        ModalService
        Logger
        Login
        Register
        Password
        clientUtils
*/

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $reactive, $state, $translate, AuthService, BookmarkTrackService, SnippetTrackService, SessionTrackService, FlowService, ModalService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.fs = FlowService;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;
    this.auth = AuthService;
    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.$rootScope.userParams = {};
    this.$rootScope.navElements = {};

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

    /*
    this.$rootScope.$on('sessionRefresh', (event, data) => {
      if (data) {
        this.reactiveLimits = this.getUserLimits();
        this.getBookmarks();
      }
      else {
        this.reactiveLimits = {};
        this.userBookmarks = [];
      }
    });
    */

    this.$rootScope.$on('updateUserParams', (event, data) => {
      angular.merge(this.$rootScope.userParams, data);
      this.$scope.$apply();
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
      },/*
      enableSnippet: () => {
        return this.getReactively('isSnippetEnabled');
      },
      enableBookmark: () => {
        return this.getReactively('enableBookmarks');
      },
      enableBookmarkList: () => {
        return this.getReactively('enableBookmarkList');
      },
      bookmarkStatus: () => {
        return this.getReactively('isPageBookmarked');
      },*/
      userParams: () => {
        return this.getReactively('userParams');
      },
      navElements: () => {
        return this.getReactively('navElements');
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

  getBookmarks() {
    if (!!Meteor.userId()) {
      this.bms.getBookmarks((err, res) => {
        if (!err) {
          this.$rootScope.userParams.bookmarkList = res;
          this.$rootScope.userParams.bookmarkCount = res.length;
          
          var maxBM = Meteor.user().profile.maxBookmarks;
          this.$rootScope.navElements.enableReady = this.$rootScope.userParams.bookmarkCount >= maxBM ? true : false;

          this.$scope.$apply();
        }
      });
    }
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
            this.$scope.$apply();
            this.getBookmarks();
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
            this.getBookmarks();
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

  readyModal() {
    // dgacitua: Modal template location is relative to NEURONE's Asset Path
    var modalObject = {
      title: this.$translate.instant('nav.taskResults'),
      templateAsset: 'modals/ready_stage1_en.html',
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