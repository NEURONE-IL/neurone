import { Meteor } from 'meteor/meteor';
import { MouseClicks } from './collection';

if (Meteor.isServer) {
  Meteor.publish('mouseclicks', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return MouseClicks.find(selector);
  });
}