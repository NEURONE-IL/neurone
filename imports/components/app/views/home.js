import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './home.html';

const name = 'home';

class Home {
  constructor($scope, $rootScope, $reactive, UserDataService) {
    'ngInject';

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      if (!!Meteor.userId()) {
        Session.set('lockButtons', true);
        this.uds.setSession({ standbyMode: false });
      }
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      if (!!Meteor.userId()) {
        this.uds.setSession({ standbyMode: true });
        this.$rootScope.$broadcast('updateNavigation');
      }
    });

    $reactive(this).attach($scope);
  }
}

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Home
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('home', {
    url: '/home',
    template: '<home></home>'
  });
};