import UserAgent from 'useragent';

import Utils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';
import { VisitedLinks } from '../../imports/api/visitedLinks/index';
import { SessionLogs } from '../../imports/api/sessionLogs/index';
import { EventLogs } from '../../imports/api/eventLogs/index';

Meteor.methods({
  storeSnippet: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Snippets.insert(jsonObject);
    //console.log('Snippet Stored!', time);
    return true;
  },
  storeQuery: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp(),
       query = jsonObject.query;

    jsonObject.serverTimestamp = time;

    Queries.insert(jsonObject);
    //console.log('Query Stored!', query, time);
    return true;
  },
  storeBookmark: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Bookmarks.insert(jsonObject);
    //console.log('Bookmark Stored!', time);
    return true;
  },
  storeVisitedLink: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    VisitedLinks.insert(jsonObject);
    //console.log('Visited Link Stored!', time);
  },
  storeSessionLog: function(jsonObject) {
    var sessionPattern = {
      userId: String,
      username: String,
      state: String,
      localTimestamp: Number
    };

    check(jsonObject, sessionPattern);

    var time = Utils.getTimestamp(),
    realTime = Utils.timestamp2datetime(time),
      ipAddr = this.connection.clientAddress,
         rua = this.connection.httpHeaders['user-agent'],     // raw user agent
         oua = rua ? UserAgent.parse(rua) : '',               // object user agent
     browser = oua ? oua.toAgent() : 'undefined',
          os = oua ? oua.os.toString() : 'undefined',
      device = oua ? oua.device.toString() : 'undefined',
       state = jsonObject.state;

    jsonObject.serverTimestamp = time;
    jsonObject.createdTime = realTime;
    jsonObject.clientAddress = ipAddr;
    jsonObject.clientBrowser = browser;
    jsonObject.clientOperatingSystem = os;
    jsonObject.clientDevice = device;
    jsonObject.userAgent = rua;

    var sessionId = SessionLogs.insert(jsonObject);

    var actionLog = {
      userId: this.userId,
      username: Meteor.user().emails[0].address, // TODO: Change to username
      action: jsonObject.state,
      actionId: sessionId,
      clientDate: Utils.timestamp2date(jsonObject.localTimestamp),
      clientTime: Utils.timestamp2time(jsonObject.localTimestamp),
      clientTimestamp: jsonObject.localTimestamp,
      serverDate: Utils.timestamp2date(time),
      serverTime: Utils.timestamp2time(time),
      serverTimestamp: time,
      ipAddr: this.connection.clientAddress,
      userAgent: this.connection.httpHeaders['user-agent'],
      extras: ''
    };

    EventLogs.insert(actionLog);
  }
});

/*
var actionLog = {
  userId: this.userId,
  username: this.userId, // TODO: Change to username
  action: '',
  actionId: '',
  clientDate: moment(jsonObject.localTimestamp).format("YYYY-MM-DD"),
  clientTime: moment(jsonObject.localTimestamp).format("HH:mm:ss.SSS"),
  clientTimestamp: jsonObject.localTimestamp,
  serverDate: moment(time).format("YYYY-MM-DD"),
  serverTime: moment(time).format("HH:mm:ss.SSS"),
  serverTimestamp: time,
  ipAddr: this.connection.clientAddress,
  userAgent: this.connection.httpHeaders['user-agent'],
  extras: ''
};
*/