import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    
    $scope.$on('$stateChangeStart', (event) => {
      this.$rootScope.navElements.enableBookmarks = false;
      this.$rootScope.navElements.enableBookmarkList = false;
      //this.stopTracking();
      this.$scope.$apply();
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.navElements.enableBookmarks = true;
      this.$rootScope.navElements.enableBookmarkList = true;
      //this.startTracking();
      this.$scope.$apply();
    });

    $reactive(this).attach($scope);
  }

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