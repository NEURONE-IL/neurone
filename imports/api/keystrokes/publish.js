import { Meteor } from 'meteor/meteor';
import { Keystrokes } from './collection';

if (Meteor.isServer) {
  Meteor.publish('keystrokes', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return Keystrokes.find(selector);
  });
}