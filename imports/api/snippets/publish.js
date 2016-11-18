import { Meteor } from 'meteor/meteor';
import { Snippets } from './collection';

if (Meteor.isServer) {
  Meteor.publish('snippets', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return Snippets.find(selector);
  });
}