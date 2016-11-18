import { Meteor } from 'meteor/meteor';
import { Keystrokes } from './collection';

if (Meteor.isServer) {
  Meteor.publish('keystrokes', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return Keystrokes.find(selector);
  });
}