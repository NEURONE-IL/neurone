import { Meteor } from 'meteor/meteor';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMeteorPromiser from 'angular-meteor-promiser';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import angularTranslate from 'angular-translate';
import angularTranslateLoader from 'angular-translate-loader-static-files';

import template from './app.html';

import { name as Auth } from './auth/auth';
import { name as Home } from './views/home';
import { name as Navigation } from './views/navigation';
import { name as Start } from './views/start';
import { name as End } from './views/end';
import { name as ErrorPage } from '../modules/error';

import { name as Search } from '../search/search';
import { name as Forms } from '../forms/formCtrl';
import { name as Synthesis } from '../synthesis/synthesis';
import { name as Showcase } from '../showcase/showcase';

import { name as AuthService } from './services/auth';
import { name as UserDataService } from './services/userData';
import { name as ActionBlocker } from './services/actionBlocker';
import { name as Flow } from './services/flow';
import { name as Logger } from '../logger/logger';

import { name as Stages } from '../session/stages';

class App {}

const name = 'app';

export default angular.module(name, [
  // Packages and dependencies
  angularMeteor,
  angularMeteorAuth,
  'angular-meteor-promiser',
  uiRouter,
  uiBootstrap,
  angularTranslate,
  angularTranslateLoader,
  // Custom-made services
  AuthService,
  UserDataService,
  Logger,
  ActionBlocker,
  Flow,
  // Prototype components
  Search,
  Synthesis,
  Forms,
  Showcase,
  // App views
  Navigation,
  Home,
  Auth,
  Start,
  End,
  ErrorPage,
  // iFuCo Simulation
  Stages
])
.component(name, {
  template,
  controllerAs: name,
  controller: App
})
.config(config)
.run(run)
.run(setTrackers);

function config($locationProvider, $urlRouterProvider, $translateProvider) {
  'ngInject';
 
  // uiRouter settings
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/home');

  // angularTranslate settings
  $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',
      suffix: '.json'
    });
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.preferredLanguage('en');
};

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if (error === 'AUTH_REQUIRED') {
      $state.go('login');
    }
  });
};

function setTrackers($rootScope, KMTrackService, LinkTrackService, ActionBlockerService) {
  'ngInject';

  lts = LinkTrackService;
  kmts = KMTrackService;
  abs = ActionBlockerService;
  
  // http://stackoverflow.com/a/20786262
  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    if (!!Meteor.userId()) {
      lts.saveEnterPage();
      kmts.service();
      abs.service();
    }
    else {
      kmts.antiService();
      abs.antiService();
    }
  });

  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
    if (!!Meteor.userId()) {
      lts.saveExitPage();
      kmts.service();
      abs.service();
    }
    else {
      kmts.antiService();
      abs.antiService();
    }
  });
};