import { Meteor } from 'meteor/meteor';
import { FlowSessions } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowSessions', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return FlowSessions.find(selector);
  });
}
