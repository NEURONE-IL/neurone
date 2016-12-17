import Utils from './lib/utils';

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

/*
UserPresence.onSessionConnected(function(connection) {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: connection.userId,
    action: 'UserConnected',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  Meteor.call('storeTrackingStatus', obj);
  console.log(obj.action, obj.userId);
});

UserPresence.onSessionDisconnected(function(connection) {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: connection.userId,
    action: 'UserDisconnected',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  Meteor.call('storeTrackingStatus', obj);
  console.log(obj.action, obj.userId);
});

UserPresence.onCleanup(function() {
  //Meteor.users.update({}, { $unset: { status: true }}, { multi: true });
});

UserPresence.onUserOnline(function(userId) {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: userId,
    action: 'StatusOnline',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  Meteor.call('storeTrackingStatus', obj);
  console.log(obj.action, obj.userId);
});

UserPresence.onUserIdle(function(userId) {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: userId,
    action: 'StatusAway',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  Meteor.call('storeTrackingStatus', obj);
  console.log(obj.action, obj.userId);
});

UserPresence.onUserOffline(function(userId) {
  var timestamp = Utils.getTimestamp();

  var obj = {
    userId: userId,
    action: 'StatusOffline',
    clientTimestamp: timestamp,
    clientDate: Utils.timestamp2date(timestamp),
    clientTime: Utils.timestamp2time(timestamp)
  };

  Meteor.call('storeTrackingStatus', obj);
  console.log(obj.action, obj.userId);
});
*/