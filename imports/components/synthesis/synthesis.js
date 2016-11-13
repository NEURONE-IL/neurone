import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import ngWig from '../../lib/ngWig/ng-wig';
import '../../lib/ngWig/css/ng-wig.css';
import '../../lib/ngWig/plugins/formats.ngWig';
import '../../lib/ngWig/plugins/forecolor.ngWig';
import '../../lib/ngWig/plugins/clear-styles.ngWig';

import Utils from '../globalUtils.js';

import template from './synthesis.html';

import { name as SnippetModal } from './templates/snippetModal';
import { name as BookmarkModal } from './templates/bookmarkModal';

class Synthesis {
  constructor($scope, $reactive, $state, $stateParams, $timeout, $interval, $translate, $uibModal) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$interval = $interval;
    this.$uibModal = $uibModal;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$stateParams = $stateParams;

    $reactive(this).attach($scope);

    this.synthesisMessage = '';
    this.messageId = 'synthesisMessage';

    this.question = '';
    this.answer = '';
    this.snippets = [];
    this.bookmarks = [];
    this.autosave = {};
    
    this.getQuestion();
    this.getSnippets();
    this.getBookmarks();

    this.autosaveService();
    this.startTime = Utils.getTimestamp();

    this.call('getSynthesisAnswer', Utils.parseStringAsInteger(this.$stateParams.id), (err, res) => {
      if (!err && res.startTime) {
        this.startTime = res.startTime;
        this.answer = res.answer;
        console.log('Answer loaded!', res);
      }
    });

    this.$onDestroy = () => {
      this.$interval.cancel(this.autosave);
    };
  }

  submit() {
    if (!!Meteor.userId()) {
      var answer = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        startTime: this.startTime,
        questionId: this.$stateParams.id,
        question: this.question,
        answer: this.answer,
        completeAnswer: true,
        local_time: Utils.getTimestamp()
      };

      this.call('storeSynthesisAnswer', answer, (err, res) => {
        if (!err) {
          console.log('Answer submitted!', answer.owner, answer.local_time);
          this.synthesisMessage = this.$translate.instant('synthesis.submitted');
          Utils.notificationFadeout(this.messageId);
        }
        else {
          console.error('Unknown Error', err);
          this.synthesisMessage = this.$translate.instant('synthesis.error');
          Utils.notificationFadeout(this.messageId);
        }
      });

      this.$interval.cancel(this.autosave);
      // TODO Go to next state
    }
  }

  autosaveService() {
    this.autosave = this.$interval(() => {
      if (!!Meteor.userId()) {
        var answer = {
          owner: Meteor.userId(),
          username: Meteor.user().emails[0].address,
          startTime: this.startTime,
          questionId: this.$stateParams.id,
          question: this.question,
          answer: this.answer,
          completeAnswer: false,
          local_time: Utils.getTimestamp()
        };

        this.call('storeSynthesisAnswer', answer, (err, res) => {
          if (!err) {
            console.log('Answer autosaved!', answer.owner, answer.local_time);
            this.synthesisMessage = this.$translate.instant('synthesis.saved');
            Utils.notificationFadeout(this.messageId);
          }
          else {
            console.error('Unknown Error', err);
            this.synthesisMessage = this.$translate.instant('synthesis.error');
            Utils.notificationFadeout(this.messageId);
          }
        });
      }
    }, Utils.sec2millis(30));
  }

  getQuestion() {
    if (!!Meteor.userId()) {
      this.call('getSynthQuestion', Utils.parseStringAsInteger(this.$stateParams.id), (err, res) => {
        if (!err) {
          this.question = res.question;
        }
        else {
          console.error('Unknown Error', err);
          this.question = 'No question';
        }
      });
    }
  }

  getSnippets() {
    if (!!Meteor.userId()) {
      this.call('getSnippets', Meteor.userId(), (err, res) => {
        if (!err) {
          this.snippets = res;
        }
        else {
          console.error(err);
        }
      });
    }
  }

  getBookmarks() {
    if (!!Meteor.userId()) {
      this.call('getBookmarks', Meteor.userId(), (err, res) => {
        if (!err) {
          this.bookmarks = res;
        }
        else {
          console.error(err);
        }
      });
    }
  }

  /*
  showSnippetModal(snippet) {
    var modalInstance = this.$uibModal.open({
      animation: true,
      ariaLabelledBy: 'Snippet',
      ariaDescribedBy: 'Snippet',
      component: SnippetModal,
      size: 'md',
      resolve: {
        item: () => {
          return snippet;
        }
      }
    });
  }
  */

  showBookmarkModal(bookmark) {
    var modalInstance = this.$uibModal.open({
      animation: true,
      ariaLabelledBy: 'Bookmark',
      ariaDescribedBy: 'Bookmark',
      component: BookmarkModal,
      size: 'lg',
      windowClass: 'modal-xl',
      resolve: {
        item: () => {
          return bookmark;
        }
      }
    });
  }
}

const name = 'synthesis';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'ngWig',
  SnippetModal,
  BookmarkModal
])
.component(name, {
  template,
  controllerAs: name,
  controller: Synthesis
})
.config(ngWigConfig)
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('synthesis', {
      url: '/synthesis?id',
      template: '<synthesis></synthesis>',
      resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};

function ngWigConfig(ngWigToolbarProvider) {
  'ngInject';

  ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
};