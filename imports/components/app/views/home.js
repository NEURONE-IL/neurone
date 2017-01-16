import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './home.html';

const name = 'home';

class Home {
  constructor($scope, $rootScope, $reactive, UserDataService) {
    'ngInject';

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      this.uds.setSession({ standbyMode: false });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ standbyMode: true });
      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
  }
}

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: Home
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('home', {
    url: '/home',
    template: '<home></home>',
    resolve: {
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      }
    }
  });
};