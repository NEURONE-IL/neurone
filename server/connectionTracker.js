import Utils from './lib/utils';

import { FlowLogs } from '../imports/api/flowLogs/index';
import { FlowSessions } from '../imports/api/flowSessions/index';

UserPresenceMonitor.onSetUserStatus((user, status, statusConnection) => {
  var userId = user._id,
    username = user.emails[0].address,
   timestamp = Utils.getTimestamp(),
        time = new Date(timestamp);

  if (status === 'online') {
    //console.log('User Online!', userId, username, status, time);
  }
  else if (status === 'offline') {
    //console.log('User Offline!', userId, username, status, time);
  }
  else if (status === 'away') {
    //console.log('User Away!', userId, username, status, time);
  }
  else {
    //console.log('User status change!', userId, username, status, time);
  }
});