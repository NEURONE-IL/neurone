import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

class DisplayPage {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    
    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: false,
        readyButton: false
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      var limit = this.uds.getConfigs().minBookmarks;
      var setReady = !!(this.uds.getSession().bookmarkCount >= limit);

      this.uds.setSession({
        bookmarkList: true,
        readyButton: setReady
      });
      
      this.$rootScope.$broadcast('updateNavigation');
      this.$rootScope.$broadcast('updateBookmarkButton');
    });

    $reactive(this).attach($scope);
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
  template: template.default,
  controllerAs: name,
  controller: DisplayPage
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('displayPage', {
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
      user($auth) {
        return $auth.awaitUser();
      }/*,
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }*/
    }
  });
};