import ServerUtils from './lib/utils';

import { Documents } from '../imports/api/documents/index';
import { Snippets } from '../imports/api/snippets/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { Keystrokes } from '../imports/api/keystrokes/index';
import { MouseClicks } from '../imports/api/mouseClicks/index';
import { MouseCoordinates } from '../imports/api/mouseCoordinates/index';

export default Meteor.methods({
  storeKeystroke: function(output) {
    var time = ServerUtils.getTimestamp();
    output.server_time = time;
    Keystrokes.insert(output);
    //console.log('Keystroke Stored!', time);
  },
  storeMouseClick: function(output) {
    var time = ServerUtils.getTimestamp();
    output.server_time = time;
    MouseClicks.insert(output);
    //console.log('Mouse Click Stored!', time);
  },
  storeMouseCoordinate: function(output) {
    var time = ServerUtils.getTimestamp();
    output.server_time = time;
    MouseCoordinates.insert(output);
    //console.log('Mouse Coordinate Stored!', time);
  },
  storeVisitedLink: function(output) {
    var time = ServerUtils.getTimestamp();
    output.server_time = time;
    VisitedLinks.insert(output);
    //console.log('Visited Link Stored!', time);
  },
  storeSnippet: function(output) {
    var time = ServerUtils.getTimestamp();
    output.server_time = time;
    Snippets.insert(output);
    //console.log('Snippet Stored!', time);
  }
});