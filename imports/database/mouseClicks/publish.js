import { Meteor } from 'meteor/meteor';
import { MouseClicks } from './collection';

if (Meteor.isServer) {
  Meteor.publish('mouseclicks', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return MouseClicks.find(selector);
  });
}