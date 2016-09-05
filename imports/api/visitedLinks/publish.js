import { Meteor } from 'meteor/meteor';
import { VisitedLinks } from './collection';

if (Meteor.isServer) {
  Meteor.publish('visitedlinks', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return VisitedLinks.find(selector);
  });
}