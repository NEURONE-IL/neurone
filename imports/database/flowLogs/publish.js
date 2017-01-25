import { Meteor } from 'meteor/meteor';
import { FlowLogs } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowLogs', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return FlowLogs.find(selector);
  });
}
