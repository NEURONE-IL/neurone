import template from './stage0.html';

class Stage0 {
  constructor($scope, $rootScope, $reactive, $translate, UserDataService) {
    
  }
}

const name = 'stage0';

// create a module
export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage0
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage0', {
    url: '/stage0',
    template: '<stage0></stage0>',
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
        return $auth.awaitUser();
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};