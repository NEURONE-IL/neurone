import { Meteor } from 'meteor/meteor';
import Utils from '../lib/utils';

import { FlowLogs } from '../../imports/api/flowLogs/index';
import { FlowSessions } from '../../imports/api/flowSessions/index';

Meteor.methods({
  syncFlowTimer: function(currentTimer) {
    var timerPattern = {
      userId: String,
      username: String,
      type: String,
      flow: Object,
      startTimestamp: Number,
      stopTimestamp: Number,
      accumulatedTime: Number,
      totalTime: Number,
      stageCounter: Number,
      currentTimestamp: Number,
      lastSyncLocalTimestamp: Number
    };

    check(currentTimer, timerPattern);

    if (!!this.userId) {
      var serverTime = Utils.getTimestamp();

      currentTimer.lastSyncServerTimestamp = serverTime;
      currentTimer.currentTimestamp = serverTime;
      
      FlowLogs.insert(currentTimer);
      FlowSessions.upsert({ userId: currentTimer.userId, startTimestamp: currentTimer.startTimestamp }, currentTimer);

      return currentTimer;
    }
    else {
      return false;
    }
  }
});