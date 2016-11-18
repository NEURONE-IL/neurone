import { Meteor } from 'meteor/meteor';
import { ScrollMoves } from './collection';

if (Meteor.isServer) {
  Meteor.publish('scrollmoves', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return ScrollMoves.find(selector);
  });
}