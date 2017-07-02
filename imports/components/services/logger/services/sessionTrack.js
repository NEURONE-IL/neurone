import { Meteor } from 'meteor/meteor';

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class SessionTrackService {
  constructor() {}

  saveSessionLog(currentState) {
    if (!!Meteor.userId()) {
      var sessionLog = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        state: currentState,
        localTimestamp: Utils.getTimestamp()
      };

      Meteor.call('storeSessionLog', sessionLog, (err, res) => {
        if (!err) {
          LogUtils.logToConsole('Session Log Saved!', sessionLog.state, sessionLog.userId, sessionLog.username, sessionLog.localTimestamp);
        }
        else {
          LogUtils.logToConsole('Unknown Error');
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