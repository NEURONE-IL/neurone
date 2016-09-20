import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';

export default class SessionTrackService {
  constructor() {}

  static saveSessionLog(currentState) {
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

  static saveLogin() {
    this.saveSessionLog('LOGIN');
  }

  static saveLogout() {
    this.saveSessionLog('LOGOUT');
  }
}