import angularTruncate from 'angular-truncate-2';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage3.html';

const name = 'stage3';

class Stage3 {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      
    });

    $reactive(this).attach($scope);
  }
}

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage3,
  bindings: {
    userBookmarksSub: '<',
    userSnippetsSub: '<'
  }
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('stage3', {
      url: '/stage3',
      template: '<stage3></stage3>',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        },
        userBookmarksSub($promiser) {
          return $promiser.subscribe('userBookmarks');
        },
        userSnippetsSub($promiser) {
          return $promiser.subscribe('userSnippets');
        }
      }
    })
};