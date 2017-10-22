import { Meteor } from 'meteor/meteor';
import Utils from '../utils/serverUtils';

import { Keystrokes, MouseClicks, MouseCoordinates, ScrollMoves } from '../database/definitions';

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