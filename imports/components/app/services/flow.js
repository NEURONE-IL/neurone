import Utils from '../../globalUtils';

class FlowService {
  constructor($state, $rootScope, $interval, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$interval = $interval;

    this.uds = UserDataService;

    this.uds.check().then((res) => {
      this.timerInterval = 1;
      this.trackerInterval = 5;
      this.synchronizerInterval = 15;

      this.timer = {};
      this.timerCount = 0;
      this.stageCount = 0;
      
      this.stages = [];
      this.stageTime = 0;
      this.totalTime = 0;
    
      // dgacitua: Triggered when stage time finishes
      this.$rootScope.$on('endStageTime', (event, data) => {
        console.log('EndStageTime', data);
        this.stageCount = 0;

        if (data < this.stages.length-1) {
          var nextState = this.stages[data+1].home;
          var state = nextState.substr(nextState.indexOf('/') + 1);
          this.$rootScope.$broadcast('timeoutModal', data);
          this.$state.go(state);
        }
        else {
          this.stopFlow();
          this.totalCount = 0;
          this.stageCount = 0;
          this.$state.go('end');
        }
      });

      // dgacitua: Triggered when simulation time finishes
      this.$rootScope.$on('endFlowTime', (event, data) => {
        console.log('EndFlowTime', data);
        this.stopFlow();
        this.totalCount = 0;
        this.stageCount = 0;
        this.$state.go('end');
      });
    });
  }

  startFlow() {
    if (!!Meteor.userId()) {
      this.uds.check().then((res) => {
        if (!this.uds.getSession().finished) {
          this.stages = this.uds.getConfigs().stages;

          for (var stage in this.stages) {
            this.totalTime += stage.length;
          }

          var tt = this.uds.getSession().totalTimer,
              st = this.uds.getSession().stageTimer;

          console.log('StartFlow', st, tt, this.stageTime, this.totalTime);
          if (tt && st) {
            this.timerCount = tt;
            this.stageCount = st;
            this.timer = this.$interval(() => { this.tick() }, Utils.sec2millis(this.timerInterval));
          }
          else {
            this.timer = this.$interval(() => { this.tick() }, Utils.sec2millis(this.timerInterval));
          }
        }        
      });
    }
  }

  stopFlow() {
    if (!!Meteor.userId()) {
      this.uds.check().then((res) => {
        this.$interval.cancel(this.timer);
      });
    }
  }

  tick() {
    this.uds.check().then((res) => {
      if (!!Meteor.userId() && res.ready()) {
        this.currentStage = this.uds.getSession().stageNumber;
        this.stageTime = this.uds.getConfigs().stages[this.currentStage].length;

        this.timerCount += this.timerInterval;
        this.stageCount += this.timerInterval;
        this.uds.setSession({ totalTimer: this.timerCount, stageTimer: this.stageCount });
        

        if (Math.trunc(this.stageCount/60) >= this.stageTime) {
          this.$rootScope.$broadcast('endStageTime', this.currentStage);
        }
        else if (Math.trunc(this.timerCount/60) >= this.totalTime) {
          this.$rootScope.$broadcast('endFlowTime', true);
        }
        else {
          console.log('Timer!', this.stageCount, this.timerCount);  
        }
      }
    });
  }


  /*
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
  */

  getServerTimestamp() {
    return Utils.getTimestamp();
  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
