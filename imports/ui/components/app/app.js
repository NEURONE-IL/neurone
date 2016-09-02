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
  Navigation
])
.component(name, {
  template,
  controllerAs: name,
  controller: App
})
.config(config)
.run(run);

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
}