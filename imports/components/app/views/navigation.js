import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { UserBookmarks, UserSnippets } from '../../userCollections';
//import { UserData } from '../../../api/_userData/index';

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
  constructor($scope, $rootScope, $window, $auth, $reactive, $state, $translate, $filter, $q, $promiser, AuthService, UserDataService, BookmarkTrackService, SnippetTrackService, SessionTrackService, FlowService, ModalService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.$filter = $filter;
    this.$window = $window;

    this.fs = FlowService;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;
    this.uds = UserDataService;
    this.auth = AuthService;
    this.modal = ModalService;

    $reactive(this).attach($scope);

    var p1 = $promiser.subscribe('userBookmarks');
    var p2 = $promiser.subscribe('userSnippets');
    var p3 = this.uds.check();

    this.navbarMessageId = 'navbarMessage';

    this._counters = new ReactiveObject({});
    
    $q.all([p1, p2, p3]).then((res) => {
      this._counters.defineProperty('bookmarks', UserBookmarks.find().count());
      this._counters.defineProperty('words', 0);

      // dgacitua: Set snippet button
      this.$rootScope.$on('updateSnippetButton', (event, data) => {
        if (data !== false) {
          var snippetCount = UserSnippets.find({ docId: data }).count();

          if (snippetCount < this.uds.getConfigs().snippetsPerPage) this.uds.setSession({ snippetButton: true });
          else this.uds.setSession({ snippetButton: false });

          console.log('enableSnippet', snippetCount, data);
        }
      });

      this.$rootScope.$on('updateNavigation', (event, data) => {
        var stage = this.uds.getSession().stageNumber;
        Utils.notificationFadeout(this.navbarMessageId);

        if (stage === 0) {
          // TODO
        }
        else if (stage === 1) {
          //this.checkBookmarkStatus();
        }
        else if (stage === 2) {
          this.checkSnippetStatus();
        }
        else if (stage === 3) {
          // TODO
        }
        else {
          // TODO
        }
      });

      this.$rootScope.$on('updateBookmarkButton', (event, data) => {
        this.checkBookmarkStatus();
      });

      this.helpers({
        isLoggedIn: () => {
          return !!Meteor.userId();
        },
        currentUser: () => {
          return Meteor.user();
        },
        counters: () => {
          return this._counters;//this.getReactively('_counters');
        },
        statusMessage: () => {
          return this.uds.getSession().statusMessage;//this.$rootScope._navbarMessage.get();
        },
        bookmarkList: () => {
          return UserBookmarks.find();//this.$rootScope._bml.list();//this.getReactively('_bookmarkList');//this.getReactively('_bookmarkList');
        },
        enableBookmark: () => {
          return this.uds.getSession().bookmarkButton;//this.$rootScope._enableBookmark.get();//this.getReactively('_enableBookmark');
        },
        enableUnbookmark: () => {
          return this.uds.getSession().unbookmarkButton;//this.$rootScope._enableUnbookmark.get();//this.getReactively('_enableUnbookmark');
        },
        enableBookmarkList: () => {
          return this.uds.getSession().bookmarkList;//this.$rootScope._enableBookmarkList.get();
        },
        enableSnippet: () => {
          return this.uds.getSession().snippetButton;//this.$rootScope._enableSnippet.get();
        },
        enableSnippetCounter: () => {
          return this.uds.getSession().snippetCounter;//this.$rootScope._enableSnippetCounter.get();
        },
        enableReady: () => {
          return this.uds.getSession().readyButton;//this.$rootScope._enableReady.get();
        },
        stageHome: () => {
          return this.uds.getSession().stageHome;//this.$rootScope._stageHome.get();
        },
        stageNumber: () => {
          return this.uds.getSession().stageNumber;//this.getReactively('_stageNumber');
        },
        standbyMode: () => {
          return this.uds.getSession().standbyMode;
        }
      });
    });
  }

  saveSnippet() {
    this.sts.saveSnippet((err, res) => {
      //this.navbarMessage = res ? res : err;
      this._counters.words = this.uds.getSession().wordCount;
      this.checkSnippetStatus();
      this.uds.setSession({ statusMessage: (res ? res : err) });
      Utils.notificationFadeout(this.navbarMessageId);
      this.$scope.$apply();
    });
  }

  checkBookmarkStatus() {
    if (!!Meteor.userId()) {
      var limit = this.uds.getConfigs().maxBookmarks;//Meteor.user() && Meteor.user().profile.maxBookmarks;
      this.uds.setSession({ bookmarkCount: UserBookmarks.find().count() });
      this._counters.bookmarks = this.uds.getSession().bookmarkCount;
      //this.$rootScope._enableReady.set((this.$rootScope._counters.bookmarks >= limit) ? true : false);
      var setReady = (this.uds.getSession().bookmarkCount >= limit) ? true : false;
      this.uds.setSession({ readyButton: setReady });

      this.bms.isBookmarked((err, res) => {
        if (!err) {
          //console.log('checkBookmarkStatus', res, this.$rootScope._counters.bookmarks, limit);
          if (this.uds.getSession().bookmarkCount > limit) {
            this.uds.setSession({ bookmarkButton: false });
            this.uds.setSession({ unbookmarkButton: false });
            //this.$rootScope._enableBookmark.set(false);
            //this.$rootScope._enableUnbookmark.set(false);
          }
          else if (this.uds.getSession().bookmarkCount === limit) {
            if (res === true) {
              this.uds.setSession({ bookmarkButton: false });
              this.uds.setSession({ unbookmarkButton: true });
              //this.$rootScope._enableBookmark.set(false);
              //this.$rootScope._enableUnbookmark.set(true);
            }
            else {
              this.uds.setSession({ bookmarkButton: false });
              this.uds.setSession({ unbookmarkButton: false });
              //this.$rootScope._enableBookmark.set(false);
              //this.$rootScope._enableUnbookmark.set(false);
            }
          }
          else {
            if (res === true) {
              this.uds.setSession({ bookmarkButton: false });
              this.uds.setSession({ unbookmarkButton: true });
              //this.$rootScope._enableBookmark.set(false);
              //this.$rootScope._enableUnbookmark.set(true);
            }
            else {
              this.uds.setSession({ bookmarkButton: true });
              this.uds.setSession({ unbookmarkButton: false });
              //this.$rootScope._enableBookmark.set(true);
              //this.$rootScope._enableUnbookmark.set(false);
            }
          }
        }
      });
    }
  }

  checkSnippetStatus() {
    if (!!Meteor.userId()) {
      var snippets = UserSnippets.find().count();
      var snippetLimit = this.uds.getConfigs().snippetsPerPage * this.uds.getConfigs().maxBookmarks;

      var setReady = (snippets >= snippetLimit) ? true : false;
      this.uds.setSession({ readyButton: setReady });

      var snippetCount = UserSnippets.find({ docId: this.uds.getSession().docId }).count();
      var setSnippet = (snippetCount < this.uds.getConfigs().snippetsPerPage) ? true : false;
      this.uds.setSession({ snippetButton: setSnippet });
    }
  }

  saveBookmark() {
    if (!!Meteor.userId()) {
      this.bookmarkAction((err, res) => {
        if (!err) {
          this.bms.saveBookmark(res.answers[0].answer, res.answers[1].answer, (err, res) => {
            //this.$rootScope._navbarMessage.set(res ? res : err);
            this.uds.setSession({ statusMessage: (res ? res : err) });
            Utils.notificationFadeout(this.navbarMessageId);
            this.$scope.$apply();
            
            if (!err) this.checkBookmarkStatus();
          });
        }
      });
    }
  }

  removeBookmark() {
    if (!!Meteor.userId()) {
      this.bms.removeBookmark((err, res) => {
        //this.$rootScope._navbarMessage.set(res ? res : err);
        this.uds.setSession({ statusMessage: (res ? res : err) });
        Utils.notificationFadeout(this.navbarMessageId);
        this.$scope.$apply();

        if (!err) this.checkBookmarkStatus();
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

    this.modal.openModal(modalObject, (err, res) => {});
  }

  tipsModal(stageNumber) {
    if (stageNumber === 1) {
      // dgacitua: Modal template location is relative to NEURONE's Asset Path
      var modalObject = {
        title: 'Tips',
        templateAsset: 'modals/tips_stage1_en.html',
        fields: {}
      };

      this.modal.openModal(modalObject, (err, res) => {});  
    }
    else {
      console.log('TipsModal', stageNumber);
    }
  }

  tutorialModal(stageNumber) {
    if (stageNumber === 1) {
      // dgacitua: Modal template location is relative to NEURONE's Asset Path
      var modalObject = {
        title: 'Tutorial',
        templateAsset: 'modals/tutorial_stage1_en.html',
        fields: {}
      };

      this.modal.openModal(modalObject, (err, res) => {});  
    }
    else {
      console.log('TutorialModal', stageNumber);
    }
  }

  bookmarkAction(callback) {
    // dgacitua: Modal template location is relative to NEURONE's Asset Path
    var modalObject = {
      title: this.$translate.instant('nav.bookmarkButton'),
      templateAsset: 'modals/bookmark_stage1_en.html',
      buttonType: 'okcancel',
      fields: {
        url: '',
        questions: [
          {
            questionId: 'bm1',
            title: 'How useful is this page?',
            type: 'rating',
            required: true,
            maxStars: 5
          },
          {
            questionId: 'bm2',
            type: 'multipleChoice',
            title: 'Why do you think so?',
            required: true,
            other: false,
            options: [
                'I like this page',
                'It\'s sources are trustworthy',
                'It\'s well written'
              ]
          }
        ]
      }
    };

    this.modal.openModal(modalObject, (err, res) => {
      if (!err) {
        if (res.message === 'ok' && res.answers) callback(null, res);
        else callback(null, false);
      }
    });
  }

  readyAction(stageNumber) {
    if (stageNumber === 0) {
      this.$rootScope.$broadcast('readyStage0');
      this.$state.go('search');
    }
    else if (stageNumber === 1) {
      // dgacitua: Modal template location is relative to NEURONE's Asset Path
      var maximumStars = 3,
         userBookmarks = UserBookmarks.find().fetch(),
              goodDocs = this.$filter('filter')(userBookmarks, { relevant: true }).length,
                 stars = goodDocs,    // TODO Make score formula
           timeWarning = false;        // TODO Enable time warning

      console.log(userBookmarks);

      var modalObject = {
        title: this.$translate.instant('nav.taskResults'),
        templateAsset: 'modals/ready_stage1_en.html',
        buttonType: (timeWarning === true ? 'nextstage' : 'back'),
        fields: {
          stars: stars,
          maxStars: maximumStars,
          goodPages: goodDocs,
          timeWarning: timeWarning,
          bookmarks: userBookmarks
        }
      };

      this.modal.openModal(modalObject, (err, res) => {
        if (!err) {
          this.$state.go('stage2');
        }
      });  
    }
    else if (stageNumber === 2) {
      this.$rootScope.$broadcast('readyStage2');
      this.$state.go('stage3');
    }
    else if (stageNumber === 3) {
      this.$rootScope.$broadcast('readyStage3');
      this.$state.go('end');
    }
    else {
      console.log('ReadyModal', stageNumber);
    }
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