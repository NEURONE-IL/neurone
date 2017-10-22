import Utils from '../utils/serverUtils';

UserPresenceMonitor.onSetUserStatus((user, status, statusConnection) => {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: user._id,
    action: 'UserConnected',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  if (status === 'away') {
    obj.action = 'StatusAway';
  }
  else if (status === 'offline') {
    obj.action = 'StatusOffline';

    // dgacitua: Delete user login tokens on logout
    //Meteor.users.update({ _id: user._id }, { $set: { 'services.resume.loginTokens': [] }});
  }
  else if (status === 'online') {
    obj.action = 'StatusOnline';
  }
  else {
    obj.action = 'StatusChange';
  }

  try {
    //EventLogs.insert(action);
    Meteor.call('storeTrackingStatus', obj);
  }
  catch (err) {
    throw new Meteor.error('DatabaseError', 'Could not save User Status in Database!', err);
  }
});