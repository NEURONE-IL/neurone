import { Meteor } from 'meteor/meteor';
import Utils from '../lib/utils';

import { VisitedLinks } from '../../imports/database/visitedLinks/index';
import { Keystrokes } from '../../imports/database/keystrokes/index';
import { MouseClicks } from '../../imports/database/mouseClicks/index';
import { MouseCoordinates } from '../../imports/database/mouseCoordinates/index';
import { ScrollMoves } from '../../imports/database/scrollMoves/index';
import { SessionLogs } from '../../imports/database/sessionLogs/index';

// NEURONE API: Input Tracking
// Methods for storing input tracking from keyboard and mouse

Meteor.methods({
  storeKeystroke: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Keystrokes.insert(jsonObject);
  },
  storeMouseClick: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    MouseClicks.insert(jsonObject);
  },
  storeMouseCoordinate: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    MouseCoordinates.insert(jsonObject);
  },
  storeScrollMove: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    ScrollMoves.insert(jsonObject);
  }
});