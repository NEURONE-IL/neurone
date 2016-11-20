import Utils from '../../globalUtils';

class FlowService {
  constructor($rootScope, $interval) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$interval = $interval;
  }

  syncTimer(syncType) {
    if (!!Meteor.userId()) {
      var localTime = Utils.getTimestamp();

      var currentTimer = {
        userId: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        type: syncType,
        startTimestamp: this.$rootScope.startTimestamp || localTime,
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

  timer() {
    TimeSync.serverTime(null, 1000);
  }


  startFlow() {
    if (!!Meteor.userId()) {
      var localTime = Utils.getTimestamp();

      this.$rootScope.startTimestamp = localTime;
      this.syncTimer('start');

      this.$rootScope.flowTimer = this.$interval(() => {
        this.syncTimer('sync');
      }, Utils.sec2millis(15));
    }
  }

  stopFlow() {
    if (!!Meteor.userId()) {
      var localTime = Utils.getTimestamp();

      this.$interval.cancel(this.$rootScope.flowTimer);

      this.syncTimer('stop');
      this.$rootScope.startTimestamp = 0;
    }
  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
