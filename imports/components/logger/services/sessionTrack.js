import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';

export default class SessionTrackService {
  constructor() {}

  saveSessionLog(currentState) {
    if (!!Meteor.userId()) {
      var sessionLog = {
        userId: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        state: currentState,
        localTimestamp: Utils.getTimestamp()
      };

      Meteor.call('storeSessionLog', sessionLog, (err, res) => {
        if (!err) {
          Utils.logToConsole('Session Log Saved!', sessionLog.state, sessionLog.userId, sessionLog.username, sessionLog.localTimestamp);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }

  saveLogin() {
    this.saveSessionLog('Login');
  }

  saveLogout() {
    this.saveSessionLog('Logout');
  }
}