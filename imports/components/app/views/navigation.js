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
const UserBookmarks = new Mongo.Collection('UserBookmarks');

class Navigation {
  constructor($scope, $rootScope, $auth, $reactive, $state, $translate, AuthService, BookmarkTrackService, SnippetTrackService, SessionTrackService, FlowService, ModalService) {
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

    this.subscribe('userBookmarks');

    this._navbarMessage = '';
    this._counters = {
      bookmarks: UserBookmarks.find().count()
    };

    this.$rootScope._enableBookmark = new ReactiveVar(false);
    this.$rootScope._enableUnbookmark = new ReactiveVar(false);
    
    // dgacitua: Set bookmark list
    this.$rootScope.$on('updateBookmarkList', (event, data) => {
      this.enableBookmarkList = data;

      if (data === true) {
        var limit = Meteor.user() && Meteor.user().profile.maxBookmarks;
        this._counters.bookmarks = UserBookmarks.find().count();
        this._enableReady = (this._counters.bookmarks >= limit) ? true : false;
      }
    });

    // dgacitua: Set bookmark/unbookmark button
    this.$rootScope.$on('updateBookmarkButton', (event, data) => {
      if (data === true) {
        this.checkBookmarkStatus();
      }
      else {
        this.$rootScope._enableBookmark.set(false);
        this.$rootScope._enableUnbookmark.set(false);
      }
    });

    this.helpers({
      isLoggedIn: () => {
        return !!Meteor.userId();
      },
      currentUser: () => {
        return Meteor.user();
      },
      counters: () => {
        return this.getReactively('_counters');
      },
      statusMessage: () => {
        return this.getReactively('_navbarMessage');
      },
      bookmarkList: () => {
        return UserBookmarks.find();//this.$rootScope._bml.list();//this.getReactively('_bookmarkList');//this.getReactively('_bookmarkList');
      },
      enableBookmark: () => {
        return this.$rootScope._enableBookmark.get();//this.getReactively('_enableBookmark');
      },
      enableUnbookmark: () => {
        return this.$rootScope._enableUnbookmark.get();//this.getReactively('_enableUnbookmark');
      },
      enableBookmarkList: () => {
        return this.getReactively('_enableBookmarkList');
      },
      enableReady: () => {
        return this.getReactively('_enableReady');
      }
    });
  }

  /*
  saveSnippet() {
    this.sts.saveSnippet((err, res) => {
      this.navbarMessage = res ? res : err;
      Utils.notificationFadeout(this.navbarMessageId);
      this.$scope.$apply();
    });
  }
  */

  checkBookmarkStatus() {
    if (!!Meteor.userId()) {
      var limit = Meteor.user() && Meteor.user().profile.maxBookmarks;
      this._counters.bookmarks = UserBookmarks.find().count();//res.length;
      this._enableReady = (this._counters.bookmarks >= limit) ? true : false;
      this.bms.isBookmarked((err2, res2) => {
        if (!err2) {
          console.log('checkBookmarkStatus', res2, this._counters.bookmarks, limit);
          if (this._counters.bookmarks > limit) {
            this.$rootScope._enableBookmark.set(false);
            this.$rootScope._enableUnbookmark.set(false);
          }
          else if (this._counters.bookmarks == limit) {
            if (res2 === true) {
              this.$rootScope._enableBookmark.set(false);
              this.$rootScope._enableUnbookmark.set(true);
            }
            else {
              this.$rootScope._enableBookmark.set(false);
              this.$rootScope._enableUnbookmark.set(false);
            }
          }
          else {
            if (res2 === true) {
              this.$rootScope._enableBookmark.set(false);
              this.$rootScope._enableUnbookmark.set(true);
            }
            else {
              this.$rootScope._enableBookmark.set(true);
              this.$rootScope._enableUnbookmark.set(false);
            }
          }
        }
      });
    }
  }

  saveBookmark() {
    if (!!Meteor.userId()) {
      this.bms.saveBookmark((err, res) => {
        this.navbarMessage = res ? res : err;
        Utils.notificationFadeout(this.navbarMessageId);
        this.$scope.$apply();
        
        if (!err) {
          this.checkBookmarkStatus();
        }
      });
    }
  }

  removeBookmark() {
    if (!!Meteor.userId()) {
      this.bms.removeBookmark((err, res) => {
        this.navbarMessage = res ? res : err;
        Utils.notificationFadeout(this.navbarMessageId);
        this.$scope.$apply();

        if (!err) {
          this.checkBookmarkStatus();
        }
      });
    }
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
        to: (Meteor.user() ? (Meteor.user().username || Meteor.user().emails[0].address) : 'you'),
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

  readyAction() {
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