import { Documents } from '../imports/api/documents/index';
import { Snippets } from '../imports/api/snippets/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { Keystrokes } from '../imports/api/keystrokes/index';
import { MouseClicks } from '../imports/api/mouseClicks/index';
import { MouseCoordinates } from '../imports/api/mouseCoordinates/index';

export default Meteor.methods({
  storeKeystrokes: function(output) {
    Keystrokes.insert(output);
    //console.log('Keystroke Stored!');
  },
  storeMouseClicks: function(output) {
    MouseClicks.insert(output);
    //console.log('Mouse Click Stored!');
  },
  storeMouseCoordinates: function(output) {
    MouseCoordinates.insert(output);
    //console.log('Mouse Coordinate Stored!');
  },
});