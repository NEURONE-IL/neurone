import { Meteor } from 'meteor/meteor';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './app.html';

import { name as Auth } from '../auth/auth';
import { name as Home } from './home';
import { name as Navigation } from './navigation';
import { name as Search } from '../search/search';
import { name as DocumentsList } from '../documents/documentsList';
import { name as DocumentDetails } from '../documents/documentDetails';
import { name as SnippetsList } from '../snippets/snippetsList';
import { name as VisitedLinksList } from '../visitedLinks/visitedLinksList';

import '../../../lib/kmtrack';
import '../../../lib/init';

class App {}

const name = 'app';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Home,
  Auth,
  Search,
  DocumentsList,
  DocumentDetails,
  SnippetsList,
  VisitedLinksList,
  Navigation
])
.component(name, {
  template,
  controllerAs: name,
  controller: App
})
.config(config)
.run(run)
.run(setTrackers);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';
 
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/home');
};

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError',
   (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
      }
    }
  );
};

function setTrackers($rootScope) {
  'ngInject';

  $rootScope.$on('$viewContentLoading', function(event, viewConfig) {
    //console.log('Exiting');
    var state = 'end';
    getLink(state);

    if (Meteor.user() == null) {
      KMTrack.antiService();
    }
  });

  $rootScope.$on('$viewContentLoaded', function(event) {
    //console.log('Entering!');
    var state = 'begin';
    getLink(state);

    if (Meteor.user()) {
      KMTrack.service();
    }
  });
};