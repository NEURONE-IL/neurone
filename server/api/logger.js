import { Meteor } from 'meteor/meteor';
import Utils from '../lib/utils';

import UserAgent from 'useragent';

import { VisitedLinks } from '../../imports/api/visitedLinks/index';
import { Keystrokes } from '../../imports/api/keystrokes/index';
import { MouseClicks } from '../../imports/api/mouseClicks/index';
import { MouseCoordinates } from '../../imports/api/mouseCoordinates/index';
import { ScrollMoves } from '../../imports/api/scrollMoves/index';
import { SessionLogs } from '../../imports/api/sessionLogs/index';

Meteor.methods({
  storeKeystroke: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Keystrokes.insert(jsonObject);
    //console.log('Keystroke Stored!', time);
  },
  storeMouseClick: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    MouseClicks.insert(jsonObject);
    //console.log('Mouse Click Stored!', time);
  },
  storeMouseCoordinate: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    MouseCoordinates.insert(jsonObject);
    //console.log('Mouse Coordinate Stored!', time);
  },
  storeScrollMove: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    ScrollMoves.insert(jsonObject);
    //console.log('Scroll Move Stored!', time);
  }
});