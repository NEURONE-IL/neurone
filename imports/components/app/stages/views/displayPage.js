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
      Session.set('lockButtons', true);

      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: false,
        backButton: false,
        readyButton: false
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      var limit = this.uds.getConfigs().minBookmarks;
      var setReady = !!(this.uds.getSession().bookmarkCount >= limit);

      this.uds.setSession({
        bookmarkList: true,
        backButton: true,
        readyButton: setReady
      }, (err, res) => {
        if (!err) {
          this.$rootScope.$broadcast('updateNavigation');
          this.$rootScope.$broadcast('updateBookmarkButton');
        }
        else {
          console.error('Error while loading Stage!', err);
        } 
      });

      
    });

    $reactive(this).attach($scope);

    this.$rootScope.$on('goBack', (event, data) => {
      this.goToPreviousState();
    });
  }

  goToPreviousState() {
    console.log(this.previousState);
    this.$state.go(this.previousState.name, this.previousState.params);
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
  controller: DisplayPage,
  bindings: {
    previousState: '='
  }
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('displayPage', {
    url: '/page/:docName',
    template: '<display-page previous-state="$resolve.previousState"></display-page>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      },
      // dgacitua: http://stackoverflow.com/a/25945003
      previousState($state, currentUser) {
        var currentStateData = {
          name: $state.current.name,
          params: $state.params,
          url: $state.href($state.current.name, $state.params)
        };

        return currentStateData;
      }
    }
  });
};