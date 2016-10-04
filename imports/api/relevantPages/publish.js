import { Meteor } from 'meteor/meteor';
import { RelevantPages } from './collection';

if (Meteor.isServer) {
  Meteor.publish('relevantPages', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return RelevantPages.find(selector);
  });
}