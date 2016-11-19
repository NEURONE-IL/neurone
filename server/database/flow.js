import Utils from '../lib/utils';

import { FlowLogs } from '../../imports/api/flowLogs/index';
import { FlowSessions } from '../../imports/api/flowSessions/index';

Meteor.methods({
  syncFlowTimer: function() {
    check(currentTimer, Object);

    if (!!this.userId()) {
      var serverTime = Utils.getTimestamp();

      var newTimer = {
        userId: currentTimer.userId,
        userName: currentTimer.startTimestamp,
        startTimestamp: currentTimer.startTime,
        currentTimestamp: serverTime,
        lastSyncLocalTimestamp: currentTimer.lastSyncLocalTimestamp,
        lastSyncServerTimestamp: serverTime
      };
      
      FlowLogs.insert(currentTimer);
      FlowSessions.upsert({ userId: currentTimer.userId, startTimestamp: currentTimer.startTimestamp }, currentTimer);

      return newTimer;
    }
    else {
      return false;
    }
  }
});