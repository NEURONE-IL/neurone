import template from './start.html';

const name = 'start';

class Start {
  constructor($scope, $reactive, $state, UserDataService) {
    'ngInject';

    this.$state = $state;

    this.uds = UserDataService;

    $reactive(this).attach($scope);
  }

  begin() {
    if (!!Meteor.userId()) {
      var currentState = this.uds.getSession().stageHome;
      console.log(currentState);

      if (!this.currentState) {
        // TODO change for Stage0 whrn implemented
        this.$state.go('search');
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
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};