import { Meteor } from 'meteor/meteor';
import { MouseCoordinates } from './collection';

if (Meteor.isServer) {
  Meteor.publish('mousecoordinates', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return MouseCoordinates.find(selector);
  });
}