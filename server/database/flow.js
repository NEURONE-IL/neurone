import Utils from '../lib/utils';

Meteor.methods({
  syncFlowTimer: function() {
    check(currentTimer, Object);

    if (!!this.userId()) {
      // TODO save timer on database

      var newTimer = {
        userId: this.userId(),
        userName: '',   // TODO replace for username
        startTime: 0,   // TODO get startTime
        currentTime: Utils.getTimestamp()
      };

      return newTimer;
    }
    else {
      return false;
    }
  }
});