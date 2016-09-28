import { Meteor } from 'meteor/meteor';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './app.html';

import { name as Auth } from './auth/auth';
import { name as Home } from './views/home';
import { name as Navigation } from './views/navigation';

import { name as Search } from '../search/search';
import { name as Showcase } from '../showcase/showcase';

import { LinkTrackService, KMTrackService } from '../logger/logger';

class App {}

const name = 'app';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Home,
  Auth,
  Navigation,
  Showcase,
  Search
])
.component(name, {
  template,
  controllerAs: name,
  controller: App
})
.service('KMTrackService', KMTrackService)
.service('LinkTrackService', LinkTrackService)
.directive('ngOnload', ngOnloadDirective)
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

function setTrackers($rootScope, KMTrackService, LinkTrackService) {
  'ngInject';

  lts = LinkTrackService;
  kmts = KMTrackService;

  $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
    //console.log('Exiting');
    if (Meteor.user()) {
      var state = 'END';
      lts.saveVisitedLink(state);
      kmts.service();
    } else {
      kmts.antiService();
    }
  });

  $rootScope.$on('$viewContentLoaded', function (event) {
    //console.log('Entering!');
    if (Meteor.user()) {
      var state = 'BEGIN';
      lts.saveVisitedLink(state);
      kmts.service();
    }
  });

  // http://stackoverflow.com/a/16204326
  $rootScope.$on('$locationChangeSuccess', function () {
    //console.log('$locationChangeSuccess changed!', new Date());
  });

  /*
  // http://stackoverflow.com/a/27984921
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!current) {
      // handle session start event
      if (Meteor.user()) {
        var state = 'RELOAD';
        lts.saveVisitedLink(state);
        kmts.service();
      }
    }
  });
  */
};

// From https://gist.github.com/mikaturunen/f0b45def06bc83ccea9e
function ngOnloadDirective() {
  return {
    restrict: "A",
      scope: {
        callback: "&ngOnload"
      },
      link: function(scope, element, attrs) {
        // hooking up the onload event
        element.on("load", () => scope.callback());
      }
  };
};