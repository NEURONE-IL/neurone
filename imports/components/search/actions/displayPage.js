import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    
    $scope.$on('$stateChangeStart', (event) => {
      this.stopTracking();
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.startTracking();
    });

    $reactive(this).attach($scope);
  }

  // dgacitua: Execute on iframe start
  startTracking() {
    var data = {
      snippets: false,
      bookmarks: true
    };

    this.$rootScope.$broadcast('setDocumentHelpers', data);
  }

  stopTracking() {
    var data = {
      snippets: false,
      bookmarks: true
    };
    
    this.$rootScope.$broadcast('setDocumentHelpers', data);
  }
}

const name = 'displayPage';

export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter
  //Logger,
  //ActionBlocker
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