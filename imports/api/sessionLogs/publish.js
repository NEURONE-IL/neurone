import { Meteor } from 'meteor/meteor';
import { MouseCoordinates } from './collection';

if (Meteor.isServer) {
  Meteor.publish('sessionLogs', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return SessionLogs.find(selector);
  });
}