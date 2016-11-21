import angular from 'angular';
import angularMeteor from 'angular-meteor';

import Utils from '../../globalUtils';

import template from './flow.html';

class Flow {
  constructor($scope, $rootScope, $reactive, $interval, FlowService) {
    'ngInject';

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$interval = $interval;
    this.fs = FlowService;

    TimeSync.resync();

    $reactive(this).attach($scope);

    this.startTimestamp = Utils.getTimestamp();
    this.currentStage = '';

    this.helpers({
      startTime: () => new Date(this.startTimestamp).toLocaleString(),
      serverTime: () => new Date(TimeSync.serverTime()).toLocaleString(),
      timeElapsed: () => (TimeSync.serverTime() - this.startTimestamp) / 1000,
      serverOffset: () => TimeSync.serverOffset(),
      serverRTT: () => TimeSync.roundTripTime()
    });

    this.flowTemplate = {
      flowId: 'fl1',
      stages: [
        { route: 'search', type: 'search', time: 7000 },
        { route: 'evaluation', type: 'evaluation', time: 3000 },
        { route: 'synthesis?id=syn3', type: 'synthesis', time: 5000 },
        { route: 'form?id=st1', type: 'form', time: 4000 }
      ]
    }
  }

  simulation() {
    // Set variables
    this.$rootScope.isOnFlow = true;
    this.$rootScope.startTime = TimeSync.serverTime();
    this.$rootScope.elapsedTime = 0;
    this.$rootScope.accumulatedTime = 0;
    this.$rootScope.simulationTime = 0;
    this.$rootScope.stageCounter = 0;
    this.$rootScope.flow = this.flowTemplate;

    this.currentStage = JSON.stringify(this.$rootScope.flow.stages[this.$rootScope.stageCounter]);

    this.$rootScope.flow.stages.forEach((stage) => {
      this.$rootScope.simulationTime += stage.time;
    });

    console.log('Starting simulation!', this.$rootScope.startTime);

    // Start timer
    this.$rootScope.timer = this.$interval(() => {
      this.$rootScope.elapsedTime += 1000;
      console.log('Timer!', this.$rootScope.elapsedTime);
    }, 1000);

    // Start flow checker
    this.$rootScope.flowCounter = this.$interval(() => {
      console.log('Flow Counter Ping!', this.$rootScope.elapsedTime);

      if (this.$rootScope.elapsedTime >= this.$rootScope.flow.stages[this.$rootScope.stageCounter].time + this.$rootScope.accumulatedTime) {
        this.$rootScope.accumulatedTime += this.$rootScope.flow.stages[this.$rootScope.stageCounter].time;
        this.$rootScope.stageCounter++;
        this.currentStage = JSON.stringify(this.$rootScope.flow.stages[this.$rootScope.stageCounter]);
      }

      if (this.$rootScope.accumulatedTime >= this.$rootScope.simulationTime) {
        this.stopSimulation();   
      }
    }, 3000);
  }

  stopSimulation() {
    this.$rootScope.stopTime = TimeSync.serverTime();
    this.$rootScope.isOnFlow = false;
    console.log('Stopping simulation!', this.$rootScope.stopTime);

    this.$interval.cancel(this.$rootScope.timer);
    this.$interval.cancel(this.$rootScope.flowCounter);
  }

  flow() {
    this.fs.startFlow();
  }

  stopFlow() {
    this.fs.stopFlow();
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