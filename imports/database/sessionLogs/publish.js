import { Meteor } from 'meteor/meteor';
import { SessionLogs } from './collection';

if (Meteor.isServer) {
  Meteor.publish('sessionLogs', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return SessionLogs.find(selector);
  });
}
