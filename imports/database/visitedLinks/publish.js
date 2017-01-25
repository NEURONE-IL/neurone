import { Meteor } from 'meteor/meteor';
import { VisitedLinks } from './collection';

if (Meteor.isServer) {
  Meteor.publish('visitedlinks', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return VisitedLinks.find(selector);
  });
}