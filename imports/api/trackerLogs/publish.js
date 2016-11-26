import { Meteor } from 'meteor/meteor';
import { TrackerLogs } from './collection';

if (Meteor.isServer) {
  Meteor.publish('trackerLogs', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return TrackerLogs.find(selector);
  });
}
