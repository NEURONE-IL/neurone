import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import ngWig from '../../lib/ngWig/ng-wig';
import '../../lib/ngWig/css/ng-wig.css';
import '../../lib/ngWig/plugins/formats.ngWig';
import '../../lib/ngWig/plugins/forecolor.ngWig';
import '../../lib/ngWig/plugins/clear-styles.ngWig';

import template from './synthesis.html';

import { name as SnippetModal } from './templates/snippetModal';
import { name as BookmarkModal } from './templates/bookmarkModal';

class Synthesis {
  constructor($scope, $reactive, $state, $stateParams, $uibModal) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$uibModal = $uibModal;

    $reactive(this).attach($scope);

    this.question = '';
    this.answer = '';
    this.snippets = [];
    this.bookmarks = [];
    
    this.getSnippets();
    this.getBookmarks();

    Meteor.call('getSynthQuestion', Utils.parseStringAsInteger($stateParams.id), (err, result) => {
      if (!err) {
        this.question = result || 'Placeholder';
        this.$scope.$apply();
      }
      else {
        console.error('Unknown Error', err);
      }
    });
  }

  submit() {

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