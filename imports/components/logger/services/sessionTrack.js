import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';

export default class SessionTrackService {
  constructor() {}

  saveSessionLog(currentState) {
    if (Meteor.user()) {
      var sessionLog = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        state: currentState,
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeSessionLog', sessionLog, (err, res) => {
        if (!err) {
          Utils.logToConsole('Session Log Saved!', sessionLog.state, sessionLog.owner, sessionLog.username, sessionLog.local_time);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }

  saveLogin() {
    this.saveSessionLog('LOGIN');
  }

  saveLogout() {
    this.saveSessionLog('LOGOUT');
  }
}