import { Meteor } from 'meteor/meteor';
import { EventLogs } from './collection';

if (Meteor.isServer) {
  Meteor.publish('eventLogs', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return EventLogs.find(selector);
  });
}
