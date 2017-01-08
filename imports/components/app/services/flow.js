import Utils from '../../globalUtils';

class FlowService {
  constructor($state, $rootScope, $interval, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$interval = $interval;

    this.uds = UserDataService;

    this.timerInterval = 5;
    //this.trackerInterval = 5;
    //this.synchronizerInterval = 15;

    this.timer = {};
    this.globalTime = 0;
    this.stageTime = 0;
    
    this.stages = [];
    this.globalTotal = 0;
    this.stageTotal = 0;

    // dgacitua: Triggered when user changes state
    this.$rootScope.$on('endStage', (event, data) => {
      console.log('EndStage', data);
      this.stages = this.uds.getConfigs().stages;
      this.stageTime = 0;

      if (data < this.stages.length-1) {
        var nextState = this.stages[data+1];
        this.uds.setSession({ currentStageName: nextState.id, currentStageNumber: data+1 }, (err, res) => {
          if (!err) {
            this.$state.go(nextState.state, nextState.urlParams, { reload: true });    
          }
        });
      }
      else {
        this.stopFlow();
        this.globalTime = 0;
        this.stageTime = 0;
        this.uds.setSession({ totalTimer: this.globalTime, stageTimer: this.stageTime });

        var nextState = this.stages.slice(-1)[0];
        this.$state.go(nextState.state, nextState.urlParams, { reload: true });
      }
    });
  
    // dgacitua: Triggered when stage time finishes
    this.$rootScope.$on('endStageTime', (event, data) => {
      console.log('EndStageTime', data);
      this.stageTime = 0;

      if (data < this.stages.length-1) {
        var nextState = this.stages[data+1];
        this.$rootScope.$broadcast('timeoutModal', data);
        this.uds.setSession({ currentStageName: nextState.id, currentStageNumber: data+1 }, (err, res) => {
          if (!err) {
            this.$state.go(nextState.state, nextState.urlParams, { reload: true });    
          }
        });
      }
      else {
        this.stopFlow();
        this.globalTime = 0;
        this.stageTime = 0;
        this.uds.setSession({ totalTimer: this.globalTime, stageTimer: this.stageTime });

        var nextState = this.stages.slice(-1)[0];
        this.$state.go(nextState.state, nextState.urlParams, { reload: true });
      }
    });

    // dgacitua: Triggered when simulation time finishes
    this.$rootScope.$on('endGlobalTime', (event, data) => {
      console.log('EndGlobalTime', data);
      this.stopFlow();
      this.globalTime = 0;
      this.stageTime = 0;
      this.uds.setSession({ totalTimer: this.globalTime, stageTimer: this.stageTime });

      var nextState = this.stages.slice(-1)[0];
      this.$state.go(nextState.state, nextState.urlParams, { reload: true });
    });
  }

  startFlow() {
    if (!!Meteor.userId()) {
      if (!this.uds.getSession().finished) {
        var gt = this.uds.getConfigs().maxGlobalTime,
            tt = this.uds.getSession().totalTimer,
            st = this.uds.getSession().stageTimer;

        this.stages = this.uds.getConfigs().stages;
        this.globalTotal = (gt >= 0) ? (gt*60) : -1;

        if (tt && st) {
          this.globalTime = tt;
          this.stageTime = st;
          console.log('Resume Timer!', 'StageTime:' + this.stageTime, 'GlobalTime:' + this.globalTime, 'StageTotal:' + this.stageTotal, 'GlobalTotal:' + this.globalTotal);
          this.timer = this.$interval(() => { this.tick() }, Utils.sec2millis(this.timerInterval));
        }
        else {
          console.log('Start Timer!', 'StageTime:' + this.stageTime, 'GlobalTime:' + this.globalTime, 'StageTotal:' + this.stageTotal, 'GlobalTotal:' + this.globalTotal);
          this.timer = this.$interval(() => { this.tick() }, Utils.sec2millis(this.timerInterval));
        }
      }        
    }
  }

  stopFlow() {
    if (!!Meteor.userId()) this.$interval.cancel(this.timer);
  }

  tick() {
    if (!!Meteor.userId()) {
      //var cs = this.uds.getSession().stageNumber,
      //    st = this.uds.getConfigs().stages[cs].time;

      var stageName = this.uds.getSession().currentStageName,
        stageNumber = this.uds.getSession().currentStageNumber,
         stageTotal = this.uds.getConfigs().stages[stageNumber].time;

      this.currentStage = stageNumber; //cs;
      this.stageTotal = (stageTotal >= 0) ? (stageTotal*60) : -1; //(st >= 0) ? (st*60) : -1;

      this.globalTime += this.timerInterval;
      this.stageTime += this.timerInterval;
      this.uds.setSession({ totalTimer: this.globalTime, stageTimer: this.stageTime });
      
      if (this.stageTotal >= 0 && this.stageTime >= this.stageTotal) {
        this.$rootScope.$broadcast('endStageTime', this.currentStage);
      }
      else if (this.globalTotal >= 0 && this.globalTime >= this.globalTotal) {
        this.$rootScope.$broadcast('endGlobalTime', true);
      }
      else {
        console.log('Timer Tick!', 'CurrentStage: ' + stageNumber + '-' + stageName, 'StageTime: ' + this.stageTime, 'GlobalTime: ' + this.globalTime, 'StageTotal: ' + this.stageTotal, 'GlobalTotal: ' + this.globalTotal);
      }
    }
  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
