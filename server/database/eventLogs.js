import UserAgent from 'useragent';

import Utils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';
import { VisitedLinks } from '../../imports/api/visitedLinks/index';
import { SessionLogs } from '../../imports/api/sessionLogs/index';
import { EventLogs } from '../../imports/api/eventLogs/index';

const snippetPattern = { userId: String, username: String, snippedText: String, title: String, url: String, localTimestamp: Number };
const queryPattern = { userId: String, username: String, query: String, title: String, url: String, localTimestamp: Number };
const linkPattern = { userId: String, username: String, state: String, title: String, url: String, localTimestamp: Number };

Meteor.methods({
  storeSnippet: function(jsonObject) {
    check(jsonObject, snippetPattern);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    var action = {
      userId: jsonObject.userId,
      username: jsonObject.username,
      action: 'Snippet',
      actionId: '',
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

    try {
      var snippetId = Snippets.insert(jsonObject);
      action.actionId = snippetId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.error('DatabaseError', 'Could not save in Database!');
    }
  },
  storeQuery: function(jsonObject) {
    check(jsonObject, queryPattern);

    var time = Utils.getTimestamp(),
       query = jsonObject.query;

    jsonObject.serverTimestamp = time;

    var action = {
      userId: jsonObject.userId,
      username: jsonObject.username,
      action: 'Query',
      actionId: '',
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

    try {
      var queryId = Queries.insert(jsonObject);
      action.actionId = queryId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.error('DatabaseError', 'Could not save in Database!');
    }
  },
  storeBookmark: function(jsonObject) {
    // TODO: Bring to EventLogs
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Bookmarks.insert(jsonObject);
    //console.log('Bookmark Stored!', time);
    return true;
  },
  storeVisitedLink: function(jsonObject) {
    check(jsonObject, linkPattern);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    var action = {
      userId: jsonObject.userId,
      username: jsonObject.username,
      action: jsonObject.state,
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

    try {
      var linkId = VisitedLinks.insert(jsonObject);
      action.actionId = linkId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.error('DatabaseError', 'Could not save in Database!');
    }
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

    var action = {
      userId: jsonObject.userId,
      username: jsonObject.username,
      action: jsonObject.state,
      actionId: '',
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

    try {
      var sessionId = SessionLogs.insert(jsonObject);
      action.actionId = sessionId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.error('DatabaseError', 'Could not save in Database!');
    }
  },
  ping: function() {
    return { status: 'success' };
  }
});

/*
var action = {
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