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
      this.$rootScope.$broadcast('updateBookmarkList', false);
      this.$rootScope.$broadcast('updateBookmarkButton', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.$broadcast('updateBookmarkList', true);
      this.$rootScope.$broadcast('updateBookmarkButton', true);
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
      },
      user: ($auth) => {
        return $auth.requireUser();
      }
    }
  });
};