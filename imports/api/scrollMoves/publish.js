import { Meteor } from 'meteor/meteor';
import { ScrollMoves } from './collection';

if (Meteor.isServer) {
  Meteor.publish('scrollmoves', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return ScrollMoves.find(selector);
  });
}