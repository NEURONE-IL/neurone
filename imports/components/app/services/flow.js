import Utils from '../../globalUtils';

class FlowService {
  constructor($state, $rootScope, $interval) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$interval = $interval;

    this.timerInterval = 1;
    this.trackerInterval = 5;
    this.synchronizerInterval = 15;

    this.flowTemplate = {
      flowId: 'fl1',
      stages: [
        { name: 'Stage 1', route: 'search', type: 'search', time: 15000 },
        { name: 'Stage 2', route: 'documents', type: 'evaluation', time: 10000 },
        { name: 'Stage 3', route: 'synthesis', params: { id: 'syn3'}, type: 'synthesis', time: 12000 },
        { name: 'Stage 4', route: 'form', params: { id: 'st1'}, type: 'form', time: 14000 }
      ]
    }
  }

  requestTimerSync(syncType) {
    if (!!Meteor.userId()) {
      var localTime = Utils.getTimestamp();

      var currentTimer = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: syncType,
        flow: this.getFlowTemplate(),
        startTimestamp: this.$rootScope.startTime || 0,
        stopTimestamp: this.$rootScope.stopTime || 0,
        accumulatedTime: this.$rootScope.accumulatedTime,
        totalTime: this.$rootScope.simulationTime,
        stageCounter: this.$rootScope.stageCounter,
        currentTimestamp: localTime,
        lastSyncLocalTimestamp: localTime
      };

      Meteor.call('syncFlowTimer', currentTimer, (err, res) => {
        if (!err) {
          console.log('Flow timer synchronized!', res);
        }
        else {
          console.error('Error while synchronizing Flow timer!', err);
        }
      });
    }
  }

  startFlow() {
    if (!!Meteor.userId()) {
      console.log('Starting flow!');

      this.resetVars();
      this.$rootScope.flow = this.getFlowTemplate();
      this.requestTimerSync('start');
      
      this.$rootScope.flowSynchronizer = this.$interval(() => {
        this.requestTimerSync('sync');
      }, Utils.sec2millis(this.synchronizerInterval));

      this.startTimer(this.timerInterval);
      this.startFlowTracker(this.trackerInterval);
    }
  }

  stopFlow() {
    if (!!Meteor.userId()) {
      this.$interval.cancel(this.$rootScope.flowSynchronizer);
      this.stopFlowTracker();
      this.stopTimer();

      this.$rootScope.stopTime = this.getServerTimestamp();
      this.$rootScope.isOnFlow = false;

      this.requestTimerSync('stop');
      this.$rootScope.flow = this.getFlowTemplate();
      this.resetVars();

      console.log('End of flow!');
      this.$state.go('home');
    }
  }

  resetVars() {
    this.$rootScope.accumulatedTime = 0;
    this.$rootScope.simulationTime = 0;
    this.$rootScope.stageCounter = 0;
  }

  startTimer(seconds) {
    this.$rootScope.elapsedTime = 0;

    this.$rootScope.timer = this.$interval(() => {
      this.$rootScope.elapsedTime += seconds * 1000;
      console.log('Timer!', this.$rootScope.elapsedTime, this.$rootScope.accumulatedTime, this.$rootScope.simulationTime);
    }, Utils.sec2millis(seconds));
  }

  stopTimer() {
    this.$interval.cancel(this.$rootScope.timer);
  }

  startFlowTracker(seconds) {
    this.$rootScope.startTime = this.getServerTimestamp();
    this.$rootScope.isOnFlow = true;

    this.$rootScope.flow.stages.forEach((stage) => {
      this.$rootScope.simulationTime += stage.time;
    });

    this.$state.go(this.$rootScope.flow.stages[this.$rootScope.stageCounter].route, this.$rootScope.flow.stages[this.$rootScope.stageCounter].params);

    this.$rootScope.flowTracker = this.$interval(() => {
      console.log('Flow Counter Ping!', this.$rootScope.elapsedTime);

      if (this.$rootScope.elapsedTime >= this.$rootScope.simulationTime) {
        this.stopFlow();
      }
      else {
        var oldStage = this.$rootScope.flow.stages[this.$rootScope.stageCounter];
        if (this.$rootScope.elapsedTime >= oldStage.time + this.$rootScope.accumulatedTime) {
          this.$rootScope.accumulatedTime += oldStage.time;
          this.$rootScope.stageCounter++;

          var newStage = this.$rootScope.flow.stages[this.$rootScope.stageCounter];
          console.log('Changing stage!', newStage.name);
          this.$state.go(newStage.route, newStage.params);
        }  
      }
    }, Utils.sec2millis(seconds));
  }

  stopFlowTracker() {
    this.$interval.cancel(this.$rootScope.flowTracker);
  }

  getFlowTemplate() {
    return this.flowTemplate;
  }

  getServerTimestamp() {
    return Utils.getTimestamp();
  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
