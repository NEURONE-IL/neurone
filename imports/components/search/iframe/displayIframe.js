import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayIframe.html';

import { name as Logger } from './services/kmTrackIframe';
import { name as ActionBlocker } from './services/actionBlockerIframe';

class DisplayIframe {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, KMTrackIframeService, ActionBlockerIframeService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.kmtis = KMTrackIframeService;
    this.abis = ActionBlockerIframeService;

    $reactive(this).attach($scope);

    this.page = $stateParams.docName;
    this.documentPage = '';
    this.documentTitle = '';
    this.renderPage($stateParams.docName);
  }

  // From https://github.com/meteor/meteor/issues/7189
  renderPage(docName) {
    this.call('getDocument', docName, (error, result) => {
      if (!error) {
        this.documentPage = result.routeUrl;
        this.documentTitle = result.title;
        this.$rootScope.documentTitle = result.title;
      }
      else {
        console.error(error);
      }
    });
  }

  // dgacitua: Execute on iframe start
  startTrackingLoader() {
    // TODO fix quick right click between transitions
    this.$rootScope.$broadcast('setDocumentHelpers', true);
    this.abis.service();
    this.kmtis.service();
  }
}

const name = 'displayIframe';

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
  controller: DisplayIframe
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('displayIframe', {
      url: '/iframe/:docName',
      template: '<display-iframe></display-iframe>',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }
      },
      onEnter: () => {},
      onExit: ($rootScope, KMTrackIframeService, ActionBlockerIframeService) => {
        this.$rootScope = $rootScope;
        this.kmtis = KMTrackIframeService;
        this.abis = ActionBlockerIframeService;

        this.kmtis.antiService();
        this.abis.antiService();
        this.$rootScope.documentTitle = '';
        this.$rootScope.$broadcast('setDocumentHelpers', false);
      }
  });
};