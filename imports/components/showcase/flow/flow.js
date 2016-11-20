import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './flow.html';

class Flow {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.serverTime = TimeSync.serverTime();
  }
}

const name = 'flow';

export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: Flow
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('flow', {
      url: '/flow',
      template: '<flow></flow>',
      resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};