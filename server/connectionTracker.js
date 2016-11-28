import Utils from './lib/utils';

import { FlowLogs } from '../imports/api/flowLogs/index';
import { FlowSessions } from '../imports/api/flowSessions/index';
import { EventLogs } from '../imports/api/eventLogs/index';

UserPresenceMonitor.onSetUserStatus((user, status, statusConnection) => {
  var userId = user._id,
    username = user.username || user.emails[0].address,
   timestamp = Utils.getTimestamp(),
        date = Utils.timestamp2date(timestamp),
        time = Utils.timestamp2time(timestamp),
      action = '';

  if (status === 'away') {
    action = 'StatusAway';
  }
  else if (status === 'offline') {
    action = 'StatusOffline';
  }
  else if (status === 'online') {
    action = 'StatusOnline';
  }
  else {
    action = 'StatusChange';
  }

  var action = {
    userId: userId,
    username: username,
    action: action,
    actionId: '',
    clientDate: date,
    clientTime: time,
    clientTimestamp: timestamp,
    serverDate: date,
    serverTime: time,
    serverTimestamp: timestamp,
    ipAddr: '',
    userAgent: '',
    extras: ''
  };

  try {
    EventLogs.insert(action);
  }
  catch (err) {
    throw new Meteor.error('DatabaseError', 'Could not save in Database!');
  }
});