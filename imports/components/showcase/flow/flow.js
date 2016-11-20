import angular from 'angular';
import angularMeteor from 'angular-meteor';

import Utils from '../../globalUtils';

import template from './flow.html';

class Flow {
  constructor($scope, $reactive) {
    'ngInject';
    
    TimeSync.resync();

    $reactive(this).attach($scope);

    this.helpers({
      startTime: () => new Date(Utils.getTimestamp()).toLocaleString(),
      serverTime: () => new Date(TimeSync.serverTime()).toLocaleString(),
      serverOffset: () => TimeSync.serverOffset(),
      serverRTT: () => TimeSync.roundTripTime()
    });
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