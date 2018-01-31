import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './documentView.html';

class DocumentView {
  constructor($scope, $rootScope, $reactive, $state, $stateParams, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
       
    $scope.$on('$stateChangeStart', (event) => {
      Session.set('standbyMode', false);
      this.uds.setSession({
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {});
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      Session.set('standbyMode', true);
      this.uds.setSession({
        readyButton: false,
        statusMessage: '',
        stageHome: 'admin'
      }, (err, res) => {});
    });

    $reactive(this).attach($scope);

    this.$rootScope.$on('goBack', (event, data) => {
      this.goToPreviousState();
    });
  }

  goToPreviousState() {
    console.log('Previous State', this.previousState);
    this.$state.go(this.previousState.name, this.previousState.params);
  }
}

const name = 'documentView';

export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: DocumentView,
  bindings: {
    previousState: '='
  }
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('documentView', {
    url: '/preview/:docName',
    template: '<document-view previous-state="$resolve.previousState"></document-view>',
    resolve: {
      userLogged($q) {
        if (!!Meteor.userId()) return $q.resolve();
        else return $q.reject('AUTH_REQUIRED');
      },
      dataReady(userLogged, $q, UserDataService) {
        let uds = UserDataService;
        return uds.ready().then(
          (res) => { return $q.resolve() },
          (err) => { return $q.reject('USERDATA_NOT_READY') }
        );
      },
      checkAdmin(dataReady, $q, UserDataService) {
        let uds = UserDataService;
        if (uds.getRole() === 'researcher') return $q.resolve();
        else return $q.reject('NO_ADMIN');
      },
      // dgacitua: http://stackoverflow.com/a/25945003
      previousState($state, checkAdmin) {
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