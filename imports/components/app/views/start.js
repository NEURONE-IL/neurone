import template from './start.html';

const name = 'start';

class Start {
  constructor($scope, $reactive, $state, UserDataService) {
    'ngInject';

    this.$state = $state;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ standbyMode: false });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ standbyMode: true });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
  }

  begin() {
    if (!!Meteor.userId()) {
      var currentState = this.uds.getSession().stageHome;
      console.log(currentState);

      if (!this.currentState) {
        this.$state.go('stage0');
      }
      else {
        var state = currentState.substr(currentState.indexOf('/') + 1);
        this.$state.go(state);
      }
    }
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template,
  controllerAs: name,
  controller: Start
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('start', {
    url: '/start',
    template: '<start></start>',
    resolve: {
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