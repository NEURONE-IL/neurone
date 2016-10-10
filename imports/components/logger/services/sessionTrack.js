import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';

export default class SessionTrackService {
  constructor() {}

  saveSessionLog(currentState) {
    if (Meteor.user()) {
      var time = Utils.getTimestamp(),
       logType = currentState,
         uname = Meteor.user().emails[0].address,
        userId = Meteor.userId();

      Utils.logToConsole('Session Log! ' + logType + ' UN:' + uname + ' UID:' + userId + ' TIME:' + time);

      var sessionLog = {
        state: logType,
        owner: userId,
        username: uname,
        local_time: time
      };

      Meteor.call('storeSessionLog', sessionLog, function(err, res) {});
    }
  }

  saveLogin() {
    this.saveSessionLog('LOGIN');
  }

  saveLogout() {
    this.saveSessionLog('LOGOUT');
  }
}