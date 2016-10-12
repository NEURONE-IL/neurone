import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

import { name as Logger } from '../../logger/logger';
import { name as ActionBlocker } from '../services/actionBlockerIframe';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, KMTrackIframeService, ActionBlockerIframeService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.kmtis = KMTrackIframeService;
    this.abs = ActionBlockerIframeService;

    // dgacitua: Execute on iframe end
    $scope.$on('$stateChangeStart', (event) => {
      this.kmtis.antiService();
      this.abs.antiService();
      this.$rootScope.$broadcast('setDocumentHelpers', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      
    });

    $reactive(this).attach($scope);

    this.documentPage = '';
    this.renderPage($stateParams.docName);
  }

  // From https://github.com/meteor/meteor/issues/7189
  renderPage(docName) {
    this.call('getDocumentPage', docName, function(error, result) {
      if (!error) {
        this.documentPage = result;
        //console.log('result', this.documents);
      }
      else {
        console.log(error);
      }
    });

    //this.documentPage = '/olympic_games.html';
  }

  // dgacitua: Execute on iframe start
  startTrackingLoader() {
    // TODO fix quick right click between transitions
    this.$rootScope.$broadcast('setDocumentHelpers', true);
    this.abs.service();
    this.kmtis.service();
  }
}

const name = 'displayPage';

export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter,
  Logger,
  ActionBlocker
])
.component(name, {
  template,
  controllerAs: name,
  controller: DisplayPage
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('displayPage', {
      url: '/page/:docName',
      template: '<display-page></display-page>',
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