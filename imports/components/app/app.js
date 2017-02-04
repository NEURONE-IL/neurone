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

import { name as Navigation } from './navigation/navigation';
import { name as Iframe } from './iframe/displayIframe';

import { name as Auth } from './auth/auth';
import { name as Home } from './views/home';
import { name as Start } from './views/start';
import { name as End } from './views/end';
import { name as ErrorPage } from './views/error';

import { name as SearchModule } from '../search/searchPage';
import { name as FormsModule } from '../forms/formCtrl';
import { name as SynthesisModule } from '../synthesis/synthesis';
import { name as ShowcaseModule } from '../showcase/showcase';

import { name as AuthService } from '../services/auth';
import { name as UserDataService } from '../services/userData';
import { name as ActionBlocker } from '../services/actionBlocker';
import { name as Flow } from '../services/flow';
import { name as Logger } from '../services/logger/logger';

import { name as Stages } from './stages/stages';

import { name as ViewDocuments } from '../modules/viewDocuments';
import { name as Enrollment } from '../modules/enrollment';

import Configs from '../globalConfigs';

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
  SearchModule,
  SynthesisModule,
  FormsModule,
  ShowcaseModule,
  // Modular Components
  Navigation,
  Iframe,
  // App views
  Auth,
  Home,
  Start,
  End,
  ErrorPage,
  // iFuCo Simulation
  Stages,
  // Other modules
  ViewDocuments,
  Enrollment
])
.component(name, {
  template,
  controllerAs: name,
  controller: App
})
.config(config)
.run(run)
.run(setTrackers);

function config($stateProvider, $locationProvider, $urlRouterProvider, $translateProvider) {
  'ngInject';
 
  // uiRouter settings
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/start');

  // angularTranslate settings
  $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',
      suffix: '.json'
    });
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.preferredLanguage('fi');
};

function run($rootScope, $state, $window, $translate, $urlRouter, FlowService, UserDataService) {
  'ngInject';

  fs = FlowService;
  uds = UserDataService;

  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    //console.log(event, toState, toParams, error);
    if (error === 'AUTH_REQUIRED') $state.go('home');
    if (error === 'WRONG_STAGE') $state.go('start');
  });

  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams, error) => {
    //console.log(event, toState, toParams);
  });

  angular.element($window).on('beforeunload', () => {
    //if (Configs.flowEnabled) fs.stopFlow();
    uds.flush();
    $window.localstorage.clear();
  });

  Accounts.onLogin(() => {
    uds.ready().then((status) => {
      if (status === 'USER_LOGGED') {
        var locale = uds.getConfigs().locale;
        
        console.log('CustomLocale', locale);

        $translate.use(locale).then(() => {
          console.log('Meteor onLogin READY!');
        });
      }
      else {
        var locale = Configs.defaultLocale;
        
        console.log('DefaultLocale', locale);

        $translate.use(locale).then(() => {
          console.log('Meteor onLogin READY!');
        });
      }
    });
  });

  Accounts.onLogout(() => {
    // PLACEHOLDER
  });
};

function setTrackers($rootScope, FlowService, KMTrackService, LinkTrackService, ActionBlockerService) {
  'ngInject';

  fs = FlowService;
  lts = LinkTrackService;
  kmts = KMTrackService;
  abs = ActionBlockerService;
  
  // http://stackoverflow.com/a/20786262
  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    if (!!Meteor.userId()) {
      lts.saveEnterPage();
      kmts.service();
      abs.service();

      // TODO: displayPage in viewDocuments
      if (Configs.flowEnabled && toState.name !== 'start' && toState.name !== 'enrollment' && toState.name !== 'viewDocuments') fs.service();
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