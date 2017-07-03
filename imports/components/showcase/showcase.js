import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './showcase.html';

import { name as DocumentsList } from './documents/documentsList';
import { name as SnippetsList } from './snippets/snippetsList';
import { name as VisitedLinksList } from './visitedLinks/visitedLinksList';
import { name as BookmarksList } from './bookmarks/bookmarksList';
import { name as Internationalization } from './i18n/i18n';
import { name as FormsExample } from './forms/formsExample';
import { name as Flow } from './flow/flow';

class Showcase {}

const name = 'showcase';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  DocumentsList,
  SnippetsList,
  VisitedLinksList,
  BookmarksList,
  Internationalization,
  FormsExample,
  Flow
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Showcase
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('showcase', {
      url: '/showcase',
      template: '<showcase></showcase>',
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