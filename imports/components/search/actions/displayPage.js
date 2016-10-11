import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

import { name as Logger } from '../../logger/logger';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, KMTrackIframeService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.kmtis = KMTrackIframeService;

    // dgacitua: Execute on iframe end
    $scope.$on('$stateChangeStart', (event) => {
      this.kmtis.antiService();
      this.$rootScope.$broadcast('setDocumentHelpers', false);
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
    this.kmtis.service();
    this.$rootScope.$broadcast('setDocumentHelpers', true);
  }
}

const name = 'displayPage';

export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter,
  Logger
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

/*
.component(name, {
  controllerAs: name,
  controller: DisplayPage,
  templateUrl:  ['$stateParams',
    function($stateParams) {
      console.log($stateParams.docName);
      return '/olympic_games.html';
    }
  ]
})
*/