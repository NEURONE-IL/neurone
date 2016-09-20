import ServerUtils from './lib/utils';

import { Documents } from '../imports/api/documents/index';
import { Snippets } from '../imports/api/snippets/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { Keystrokes } from '../imports/api/keystrokes/index';
import { MouseClicks } from '../imports/api/mouseClicks/index';
import { MouseCoordinates } from '../imports/api/mouseCoordinates/index';
import { SessionLogs } from '../imports/api/sessionLogs/index';

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
    console.log('Session Log Stored!', ipAddr, state, time);
  }
});