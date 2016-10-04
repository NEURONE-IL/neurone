import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

import { KMTrackIframeService } from '../../logger/logger';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, KMTrackIframeService) {
    'ngInject';

    kmtis = KMTrackIframeService;

    this.$state = $state;

    $rootScope.$broadcast('setRelevantPageButton', true);

    // dgacitua: Execute on iframe end
    $scope.$on('$stateChangeStart', function (event) {
      kmtis.antiService();
      $rootScope.$broadcast('setRelevantPageButton', false);
    });

    // dgacitua: Execute on iframe start
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

  startTrackingLoader() {
    //console.log("IFRAME In!");
    kmtis.service();
  }
}

const name = 'displayPage';

// create a module
export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: DisplayPage
})
.config(config)
.service('KMTrackIframeService', KMTrackIframeService);

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