import ServerUtils from './lib/utils';

import { Documents } from '../imports/api/documents/index';
import { Snippets } from '../imports/api/snippets/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { Keystrokes } from '../imports/api/keystrokes/index';
import { MouseClicks } from '../imports/api/mouseClicks/index';
import { MouseCoordinates } from '../imports/api/mouseCoordinates/index';
import { ScrollMoves } from '../imports/api/scrollMoves/index';
import { SessionLogs } from '../imports/api/sessionLogs/index';
import { Queries } from '../imports/api/queries/index';
import { Bookmarks } from '../imports/api/bookmarks/index';

export default Meteor.methods({
  storeKeystroke: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    Keystrokes.insert(jsonObject);
    //console.log('Keystroke Stored!', time);
  },
  storeMouseClick: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    MouseClicks.insert(jsonObject);
    //console.log('Mouse Click Stored!', time);
  },
  storeMouseCoordinate: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    MouseCoordinates.insert(jsonObject);
    //console.log('Mouse Coordinate Stored!', time);
  },
  storeScrollMove: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    ScrollMoves.insert(jsonObject);
    //console.log('Scroll Move Stored!', time);
  },
  storeVisitedLink: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    VisitedLinks.insert(jsonObject);
    //console.log('Visited Link Stored!', time);
  },
  storeSnippet: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;
    Snippets.insert(jsonObject);
    //console.log('Snippet Stored!', time);
  },
  storeSessionLog: function(jsonObject) {
    var time = ServerUtils.getTimestamp(),
      ipAddr = this.connection.clientAddress,
       state = jsonObject.state;

    jsonObject.server_time = time;
    jsonObject.clientAddress = ipAddr;
    SessionLogs.insert(jsonObject);
    //console.log('Session Log Stored!', ipAddr, state, time);
  },
  storeQuery: function(jsonObject) {
    var time = ServerUtils.getTimestamp(),
       query = jsonObject.query;

    jsonObject.server_time = time;
    Queries.insert(jsonObject);
    //console.log('Query Stored!', query, time);
  },
  storeBookmark: function(jsonObject) {
    var time = ServerUtils.getTimestamp();
        page = jsonObject.url;

    jsonObject.server_time = time;
    Bookmarks.insert(jsonObject);
    //console.log('Bookmark Stored!', page, time);
  },
  removeBookmark: function(userId, currentUrl) {
    Bookmarks.remove({ owner: userId, url: currentUrl });
  },
  getBookmark: function(currentUrl) {
    return Bookmarks.find({ url: currentUrl }).fetch();
  },
  isBookmark: function(currentUrl) {
    var bkms = Bookmarks.find({ url: currentUrl }).fetch();
    return bkms.length > 0;
  }
});