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
      //this.$rootScope.$broadcast('updateBookmarkList', false);
      this.uds.setSession({ bookmarkButton: false });
      this.uds.setSession({ unbookmarkButton: false });
      this.uds.setSession({ bookmarkList: false });
      this.uds.setSession({ readyButton: false });
      //this.uds.setSession({ stageHome: '/home' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      //this.$rootScope.$broadcast('updateBookmarkList', true);
      var limit = this.uds.getConfigs().maxBookmarks;
      var setReady = (this.uds.getSession().bookmarkCount >= limit) ? true : false;

      this.uds.setSession({ bookmarkList: true });
      this.uds.setSession({ stageNumber: 1 });
      this.uds.setSession({ readyButton: setReady });
      this.uds.setSession({ stageHome: '/search' });

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
  template,
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
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};