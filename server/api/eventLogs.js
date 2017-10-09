import { Meteor } from 'meteor/meteor';
import UserAgent from 'useragent';

import Utils from '../utils/serverUtils';

import { EventLogs, SessionLogs, Snippets, Queries, Bookmarks, VisitedLinks, FormAnswers, Counters } from '../database/definitions';

// NEURONE API: Event Logs
// Methods for storing actions made by users in NEURONE simulation

const queryPattern = { userId: String, username: String, query: String, title: String, url: String, localTimestamp: Number };
const bookmarkPattern = { userId: String, username: String, action: String, title: String, url: String, docId: String, relevant: Boolean, rating: Number, reason: String, userMade: Boolean, localTimestamp: Number };
const snippetPattern = { userId: String, username: String, action: String, snippetId: Number, snippedText: String, title: String, url: String, docId: String, localTimestamp: Number };
const linkPattern = { userId: String, username: String, state: String, title: String, url: String, localTimestamp: Number };
const sessionPattern = { userId: String, username: String, state: String, localTimestamp: Number };
const formResponsePattern = { userId: String, username: String, action: String, reason: String, answer: Array, localTimestamp: Number };
const trackingStatusPattern = { userId: String, action: String, clientTimestamp: Number, clientDate: String, clientTime: String };

Meteor.methods({
  // dgacitua: Save a user query in database
  //           PARAMS: userQuery (User query in JSON format)
  //           RETURNS: 'success' status object
  storeQuery: function(userQuery) {
    try {
      check(userQuery, queryPattern);

      var time = Utils.getTimestamp(),
         query = userQuery.query;

      userQuery.serverTimestamp = time;

      var action = {
        userId: userQuery.userId,
        username: userQuery.username,
        action: 'Query',
        actionId: '',
        clientDate: Utils.timestamp2date(userQuery.localTimestamp),
        clientTime: Utils.timestamp2time(userQuery.localTimestamp),
        clientTimestamp: userQuery.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: ''
      };

      var queryId = Queries.insert(userQuery);
      action.actionId = queryId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(551, 'Could not save Query in Database!', err);
    }
  },
  // dgacitua: Save a user bookmark or unbookmark in database
  //           PARAMS: userBookmark (User bookmark action in JSON format)
  //           RETURNS: 'success' status object
  storeBookmark: function(userBookmark) {
    try {
      check(userBookmark, bookmarkPattern);

      var time = Utils.getTimestamp();
      userBookmark.serverTimestamp = time;

      var action = {
        userId: userBookmark.userId,
        username: userBookmark.username,
        action: userBookmark.action,
        actionId: '',
        clientDate: Utils.timestamp2date(userBookmark.localTimestamp),
        clientTime: Utils.timestamp2time(userBookmark.localTimestamp),
        clientTimestamp: userBookmark.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: ''
      };

      var bookmarkId = Bookmarks.insert(userBookmark);
      action.actionId = bookmarkId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(552, 'Could not save Bookmark in Database!', err);
    }
  },
  // dgacitua: Save a user snippet or unsnippet in database
  //           PARAMS: userSnippet (User snippet action in JSON format)
  //           RETURNS: 'success' status object
  storeSnippet: function(userSnippet) {
    try {
      check(userSnippet, snippetPattern);

      var time = Utils.getTimestamp();
      userSnippet.serverTimestamp = time;
      userSnippet.snippetId = (userSnippet.action === 'Snippet') ? incrementCounter(Counters, 'snippetId') : userSnippet.snippetId;

      var action = {
        userId: userSnippet.userId,
        username: userSnippet.username,
        action: userSnippet.action,
        actionId: '',
        clientDate: Utils.timestamp2date(userSnippet.localTimestamp),
        clientTime: Utils.timestamp2time(userSnippet.localTimestamp),
        clientTimestamp: userSnippet.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: ''
      };
    
      var snippetId = Snippets.insert(userSnippet);
      action.actionId = snippetId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(553, 'Could not save Snippet in Database!', err);
    }
  },
  // dgacitua: Save a user visited link (page) in database
  //           PARAMS: userVisitedLink (User visited link in JSON format)
  //           RETURNS: 'success' status object
  storeVisitedLink: function(userVisitedLink) {
    try {
      check(userVisitedLink, linkPattern);

      var time = Utils.getTimestamp();
      userVisitedLink.serverTimestamp = time;

      var action = {
        userId: userVisitedLink.userId,
        username: userVisitedLink.username,
        action: userVisitedLink.state,
        actionId: '',
        clientDate: Utils.timestamp2date(userVisitedLink.localTimestamp),
        clientTime: Utils.timestamp2time(userVisitedLink.localTimestamp),
        clientTimestamp: userVisitedLink.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: ''
      };
    
      var linkId = VisitedLinks.insert(userVisitedLink);
      action.actionId = linkId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(554, 'Could not save Visited Link in Database!', err);
    }
  },
  // dgacitua: Save a user login or logout in database
  //           PARAMS: userSession (User session action in JSON format)
  //           RETURNS: 'success' status object
  storeSessionLog: function(userSession) {
    try {
      check(userSession, sessionPattern);

      var time = Utils.getTimestamp(),
      realTime = Utils.timestamp2datetime(time),
        ipAddr = this.connection ? this.connection.clientAddress : '',
           rua = this.connection ? this.connection.httpHeaders['user-agent'] : '',   // raw user agent
           oua = rua ? UserAgent.parse(rua) : '',               // object user agent
       browser = oua ? oua.toAgent() : 'undefined',
            os = oua ? oua.os.toString() : 'undefined',
        device = oua ? oua.device.toString() : 'undefined',
         state = userSession.state;

      userSession.serverTimestamp = time;
      userSession.createdTime = realTime;
      userSession.clientAddress = ipAddr;
      userSession.clientBrowser = browser;
      userSession.clientOperatingSystem = os;
      userSession.clientDevice = device;
      userSession.userAgent = rua;

      var action = {
        userId: userSession.userId,
        username: userSession.username,
        action: userSession.state,
        actionId: '',
        clientDate: Utils.timestamp2date(userSession.localTimestamp),
        clientTime: Utils.timestamp2time(userSession.localTimestamp),
        clientTimestamp: userSession.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: ''
      };

      var sessionId = SessionLogs.insert(userSession);
      action.actionId = sessionId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(555, 'Could not save Session Log in Database!', err);
    }
  },
  // dgacitua: Save a form response in EventLogs collection
  //           PARAMS: formResponse (Form response in JSON format)
  //           RETURNS: 'success' status object
  storeFormResponse: function(formResponse) {
    try {
      check(formResponse, formResponsePattern);

      var time = Utils.getTimestamp();
      formResponse.serverTimestamp = time;

      var action = {
        userId: formResponse.userId,
        username: formResponse.username,
        action: formResponse.action,
        actionId: '',
        clientDate: Utils.timestamp2date(formResponse.localTimestamp),
        clientTime: Utils.timestamp2time(formResponse.localTimestamp),
        clientTimestamp: formResponse.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: formResponse.reason
      };

      var answerId = FormAnswers.insert(formResponse);
      action.actionId = answerId;
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(556, 'Could not save Form Response in Database!', err);
    }
  },
  // dgacitua: Save a custom event in EventLogs collection
  //           PARAMS: customEvent (Custom event action in JSON format)
  //           RETURNS: 'success' status object
  storeCustomEvent: function(customEvent) {
    try {
      var time = Utils.getTimestamp();

      var action = {
        userId: customEvent.userId,
        username: customEvent.username,
        action: customEvent.action,
        actionId: '',
        clientDate: Utils.timestamp2date(customEvent.localTimestamp),
        clientTime: Utils.timestamp2time(customEvent.localTimestamp),
        clientTimestamp: customEvent.localTimestamp,
        serverDate: Utils.timestamp2date(time),
        serverTime: Utils.timestamp2time(time),
        serverTimestamp: time,
        ipAddr: (this.connection ? this.connection.clientAddress : ''),
        userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
        extras: customEvent.extras,
      };
      
      EventLogs.insert(action);

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(557, 'Could not save Custom Event in Database!', err);
    }
  },
  // dgacitua: Save a tracking status action (online, offline, away) in EventLogs collection
  //           PARAMS: trackingStatus (Tracking status action in JSON format)
  //           RETURNS: 'success' status object
  storeTrackingStatus: function(trackingStatus) {
    try {
      check(trackingStatus, trackingStatusPattern);

      var time = Utils.getTimestamp(),
          user = Meteor.users.findOne({ _id: trackingStatus.userId });

      trackingStatus.username = user.username || user.emails[0].address;
      trackingStatus.actionId = '';
      trackingStatus.serverTimestamp = time;
      trackingStatus.serverDate = Utils.timestamp2date(time);
      trackingStatus.serverTime = Utils.timestamp2time(time);
      trackingStatus.ipAddr = '';
      trackingStatus.userAgent = '';
      trackingStatus.extras = '';

      EventLogs.insert(trackingStatus);

      return { status: 'success' };
    }
    catch(err) {
      throw new Meteor.Error(558, 'Could not save Tracking Status in Database!', err);
    }
  },
  // dgacitua: Ping to NEURONE API
  //           PARAMS: <none>
  //           RETURNS: 'success' status object
  ping: function() {
    return { status: 'success', serverTimestamp: Utils.getTimestamp() };
  }
});